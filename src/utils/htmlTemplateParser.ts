/**
 * Helper to parse, sanitize, and assemble custom HTML/CSS/JS templates
 */
import { CLOSED_ENVELOPE_DATA_URI } from '../data/envelopeAsset';
import { getAntiTheftIframeScript, minifyAndProtectHtml } from './antiTheftProtection';

export interface ParsedTemplateCode {
  html: string;
  css: string;
  js: string;
  isFullDocument: boolean;
}

/**
 * Removes dangerous anti-inspection debugger traps and blocking loops
 * commonly found in scraped or protected templates.
 */
export function sanitizeCustomCode(code: string): string {
  if (!code) return '';

  let sanitized = code;

  // Remove debugger statements
  sanitized = sanitized.replace(/\bdebugger\s*;?/g, '// debugger disabled');

  // Remove anti-tamper interval loops like:
  // setInterval(function () { const startTime = performance.now(); debugger; ... }, 1000);
  sanitized = sanitized.replace(
    /setInterval\s*\(\s*function\s*\(\s*\)\s*\{[^}]*debugger[^}]*\}\s*,\s*\d+\s*\);?/gs,
    '/* Anti-debugger trap removed by system */'
  );

  // Remove "Təhlükəsizlik qaydalarını pozduğunuz üçün giriş bloklandı!" trap
  sanitized = sanitized.replace(
    /if\s*\(\s*endTime\s*-\s*startTime\s*>\s*\d+\s*\)\s*\{[^}]*document\.body\.innerHTML[^}]*\}/gs,
    '/* Tamper screen wipe removed */'
  );

  return sanitized;
}

/**
 * Splits a full HTML document (containing <!doctype html>, <style>, <script>)
 * into its constituent HTML, CSS, and JS components.
 */
export function splitFullHtmlDocument(fullHtml: string): ParsedTemplateCode {
  const sanitized = sanitizeCustomCode(fullHtml);

  // Check if it's a full HTML document
  const isFull = /<!doctype\s+html/i.test(sanitized) || /<html[\s>]/i.test(sanitized);

  if (!isFull) {
    return {
      html: sanitized,
      css: '',
      js: '',
      isFullDocument: false,
    };
  }

  // Extract all <style> blocks
  const cssMatches: string[] = [];
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleRegex.exec(sanitized)) !== null) {
    if (styleMatch[1]) {
      cssMatches.push(styleMatch[1].trim());
    }
  }

  // Extract all inline <script> blocks (excluding external script tags like src="...")
  const jsMatches: string[] = [];
  const scriptRegex = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(sanitized)) !== null) {
    if (scriptMatch[1]) {
      jsMatches.push(scriptMatch[1].trim());
    }
  }

  // Extract external resources in <head> like <link rel="stylesheet"> or <script src="...">
  const headLinks: string[] = [];
  const headLinkRegex = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  let linkMatch;
  while ((linkMatch = headLinkRegex.exec(sanitized)) !== null) {
    headLinks.push(linkMatch[0]);
  }

  const externalScripts: string[] = [];
  const extScriptRegex = /<script\b[^>]*\bsrc=["'][^"']+["'][^>]*><\/script>/gi;
  let extScriptMatch;
  while ((extScriptMatch = extScriptRegex.exec(sanitized)) !== null) {
    externalScripts.push(extScriptMatch[0]);
  }

  // Extract body content or clean HTML
  let bodyContent = '';
  const bodyMatch = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(sanitized);
  if (bodyMatch && bodyMatch[1]) {
    bodyContent = bodyMatch[1];
  } else {
    bodyContent = sanitized;
  }

  // Remove <style> and <script> from the body content
  bodyContent = bodyContent
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .trim();

  // Prepend head links if any were extracted
  const finalHtml = (headLinks.length ? headLinks.join('\n') + '\n\n' : '') + bodyContent;
  const finalCss = cssMatches.join('\n\n');
  const finalJs = (externalScripts.length ? '// External scripts: ' + externalScripts.join(', ') + '\n' : '') + jsMatches.join('\n\n');

  return {
    html: finalHtml,
    css: finalCss,
    js: finalJs,
    isFullDocument: true,
  };
}

/**
 * Compiles HTML, CSS, JS and Invitation Data into a complete, standalone HTML page
 * suitable for an isolated sandboxed iframe.
 */
export function buildStandaloneHtmlDocument(params: {
  html: string;
  css: string;
  js: string;
  invitation: any;
  formattedDate?: string;
  mapUrl?: string;
  templateMedia?: {
    closedEnvelopeImage?: string;
    openingVideo?: string;
    openingVideoSpeed?: number;
    openingVideoTrimSeconds?: number;
    backgroundMediaType?: 'image' | 'video';
    backgroundImage?: string;
    backgroundVideo?: string;
  };
  templateColors?: {
    background?: string;
    text?: string;
    accent?: string;
    border?: string;
    muted?: string;
  };
}): string {
  const { html, css, js, invitation, formattedDate = '', mapUrl = '', templateMedia = {}, templateColors = {} } = params;

  // Resolve template-level media overrides, falling back to the built-in
  // envelope-opening defaults so existing templates keep working untouched.
  const customClosedEnvelopeImage = (templateMedia.closedEnvelopeImage || '').trim();
  const customOpeningVideo = (templateMedia.openingVideo || '').trim();
  // Clamp to a sane range: 0.25x (very slow) to 3x (very fast).
  const rawOpeningSpeed = templateMedia.openingVideoSpeed;
  const openingVideoSpeed =
    typeof rawOpeningSpeed === 'number' && !Number.isNaN(rawOpeningSpeed)
      ? Math.min(3, Math.max(0.25, rawOpeningSpeed))
      : 1;
  // 0 / undefined means "no trim, play the full video".
  const rawTrim = templateMedia.openingVideoTrimSeconds;
  const openingVideoTrimSeconds =
    typeof rawTrim === 'number' && !Number.isNaN(rawTrim) && rawTrim > 0 ? Math.min(60, rawTrim) : 0;
  const backgroundMediaType = templateMedia.backgroundMediaType || 'video';
  const customBackgroundImage = (templateMedia.backgroundImage || '').trim();
  const customBackgroundVideo = (templateMedia.backgroundVideo || '').trim();

  // Resolve template-level color overrides. Only emit CSS variables for colors
  // that were actually customized — everything else keeps using the design's
  // own built-in fallback color declared inside var(--tpl-x, #default).
  const colorVarMap: Record<string, string | undefined> = {
    '--tpl-bg': templateColors.background,
    '--tpl-text': templateColors.text,
    '--tpl-accent': templateColors.accent,
    '--tpl-border': templateColors.border,
    '--tpl-muted': templateColors.muted,
  };
  const activeColorVars = Object.entries(colorVarMap).filter(([, v]) => v && v.trim());
  const colorOverrideCss =
    activeColorVars.length > 0
      ? `\n:root{${activeColorVars.map(([k, v]) => `${k}:${v};`).join('')}}\n`
      : '';

  // Check if raw HTML is already a complete <!doctype html> document
  let rawHtmlSanitized = sanitizeCustomCode(html || '');

  // Automatic compatibility patch for envelope opening video (fixes QuickTime .mov in Chrome/Android)
  if (rawHtmlSanitized.includes('presentational-3') || rawHtmlSanitized.includes('opening-video')) {
    rawHtmlSanitized = rawHtmlSanitized.replace(
      /https:\/\/devetname-boy-girl\.vercel\.app\/presentational-3%20kopyas%C4%B1\.mov/g,
      '/envelope_opening.mp4'
    );
    rawHtmlSanitized = rawHtmlSanitized.replace(
      /\/presentational-3%20kopyas%C4%B1\.mov/g,
      '/envelope_opening.mp4'
    );
    rawHtmlSanitized = rawHtmlSanitized.replace(
      /\/presentational-3\s+kopyas[^\."'>]*\.mov/g,
      '/envelope_opening.mp4'
    );
  }

  // Automatic compatibility patch for hero background video
  if (rawHtmlSanitized.includes('hero-background') && !rawHtmlSanitized.includes('id="hero-bg-video"')) {
    rawHtmlSanitized = rawHtmlSanitized.replace(
      /<div class="hero-background">\s*<video/g,
      '<div class="hero-background"><video id="hero-bg-video"'
    );
  }

  // Template-level override: custom opening video (replaces the default /envelope_opening.mp4)
  if (customOpeningVideo) {
    rawHtmlSanitized = rawHtmlSanitized.replace(/\/envelope_opening\.mp4/g, customOpeningVideo);
  }

  // Template-level override: custom background video (replaces the default /hero-video.mp4)
  if (backgroundMediaType === 'video' && customBackgroundVideo) {
    rawHtmlSanitized = rawHtmlSanitized.replace(/\/hero-video\.mp4/g, customBackgroundVideo);
  }

  // Template-level override: background is a static image instead of a video —
  // hide the hero background video and paint the chosen image behind it via CSS.
  let backgroundImageOverrideCss = '';
  if (backgroundMediaType === 'image' && customBackgroundImage) {
    backgroundImageOverrideCss = `\n.hero-background{background-image:url('${customBackgroundImage}');background-size:cover;background-position:center;}\n.hero-background video{display:none !important;}\n`;
  }

  // Speed optimization: remove slow third-party Vercel video sources that block loading
  rawHtmlSanitized = rawHtmlSanitized.replace(
    /<source[^>]*src="https:\/\/devetname-boy-girl\.vercel\.app\/[^"]*"[^>]*>/g,
    ''
  );

  // Speed optimization: prevent hero video from blocking initial page load
  rawHtmlSanitized = rawHtmlSanitized
    .replace(/(<video[^>]*id="hero-bg-video"[^>]*)autoplay/g, '$1')
    .replace(/(<video[^>]*id="hero-bg-video"[^>]*)preload="auto"/g, '$1preload="none"');

  // Fix premature video skipping in custom code templates:
  // 1. Prevent synthetic click/touch duplication from triggering premature open
  rawHtmlSanitized = rawHtmlSanitized.replace(
    /if\s*\(\s*isOpeningStarted\s*\)\s*\{\s*triggerOpenMain\(\);\s*return;\s*\}/g,
    'if (isOpeningStarted) return;'
  );
  // 2. Remove click listener on openingVideo that aborts playback on screen touch
  rawHtmlSanitized = rawHtmlSanitized.replace(
    /if\s*\(\s*openingVideo\s*\)\s*\{\s*openingVideo\.addEventListener\(\s*["']click["']\s*,\s*function\s*\([^\)]*\)\s*\{[^}]*triggerOpenMain\(\);[^}]*\}\s*\);\s*\}/g,
    '/* openingVideo click listener removed to prevent premature skip */'
  );
  // 3. Extend tight 5400ms timer to generous 12000ms safety timeout
  rawHtmlSanitized = rawHtmlSanitized.replace(
    /5400\);/g,
    '12000);'
  );

  // 4. Ensure no skip button exists (full video viewing is strictly enforced)
  rawHtmlSanitized = rawHtmlSanitized.replace(
    /<button[^>]*id="skip-envelope-btn"[^>]*>[\s\S]*?<\/button>/gi,
    ''
  );

  const isCompleteDoc = /<!doctype\s+html/i.test(rawHtmlSanitized) || /<html[\s>]/i.test(rawHtmlSanitized);

  // Calculate day, month name, and year for Azerbaijani wedding dates
  let day = '12';
  let month = 'SENTYABR';
  let year = '2026';
  try {
    const d = new Date(invitation.weddingDate || '2026-09-12');
    if (!isNaN(d.getTime())) {
      day = String(d.getDate()).padStart(2, '0');
      const monthsAz = [
        'YANVAR', 'FEVRAL', 'MART', 'APREL', 'MAY', 'İYUN',
        'İYUL', 'AVQUST', 'SENTYABR', 'OKTYABR', 'NOYABR', 'DEKABR'
      ];
      month = monthsAz[d.getMonth()];
      year = String(d.getFullYear());
    }
  } catch (e) {}

  // Generate robust Google Maps & Waze navigation links based on coordinates or venue name & address
  const venueLocationText = [invitation.venue, invitation.address, invitation.city || '']
    .filter(Boolean)
    .join(', ');
  const venueQuery = encodeURIComponent(venueLocationText || '');

  let googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;
  let wazeUrl = `https://waze.com/ul?q=${venueQuery}&navigate=yes`;

  if (invitation.mapCoordinates?.lat && invitation.mapCoordinates?.lng) {
    const lat = invitation.mapCoordinates.lat;
    const lng = invitation.mapCoordinates.lng;
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }
  if (mapUrl && mapUrl.trim().startsWith('http')) {
    googleMapsUrl = mapUrl;
  }
  if (invitation.wazeUrl && invitation.wazeUrl.trim().startsWith('http')) {
    wazeUrl = invitation.wazeUrl.trim();
  }

  // Replace placeholders helper
  const replacePlaceholders = (str: string): string => {
    let result = str
      .replace(/\{\{brideName\}\}/g, invitation.brideName || 'Sevinc')
      .replace(/\{\{groomName\}\}/g, invitation.groomName || 'Asim')
      .replace(/\{\{coupleNames\}\}/g, `${invitation.brideName || 'Sevinc'} & ${invitation.groomName || 'Asim'}`)
      .replace(/\{\{brideParents\}\}/g, invitation.brideParents || '')
      .replace(/\{\{groomParents\}\}/g, invitation.groomParents || '')
      .replace(/\{\{weddingDate\}\}/g, formattedDate || `${day} ${month} ${year}`)
      .replace(/\{\{weddingDay\}\}/g, day)
      .replace(/\{\{weddingMonth\}\}/g, month)
      .replace(/\{\{weddingYear\}\}/g, year)
      .replace(/\{\{rawWeddingDate\}\}/g, invitation.weddingDate || '2026-09-12')
      .replace(/\{\{weddingTime\}\}/g, invitation.weddingTime || '18:00')
      .replace(/\{\{venue\}\}/g, invitation.venue || 'Şadlıq Sarayı')
      .replace(/\{\{address\}\}/g, invitation.address || 'Bakı şəhəri')
      .replace(/\{\{city\}\}/g, invitation.city || 'Bakı')
      .replace(/\{\{customText\}\}/g, invitation.customText || 'Həyatımızın ən gözəl günündə sizi aramızda görməkdən şad olarıq.')
      .replace(/\{\{dressCode\}\}/g, invitation.dressCode || 'Klassik / Zərif Geyim')
      .replace(/\{\{heroImage\}\}/g, invitation.heroImage || '')
      .replace(/\{\{contactPhone\}\}/g, invitation.contactPhone || '994500000000')
      .replace(/\{\{musicTitle\}\}/g, invitation.musicTitle || 'Toy Valsı')
      .replace(/\{\{musicUrl\}\}/g, invitation.music && invitation.music.trim() !== '' ? invitation.music : '/wedding-music.mp3')
      .replace(/\{\{googleMapsUrl\}\}/g, googleMapsUrl)
      .replace(/\{\{wazeUrl\}\}/g, wazeUrl)
      .replace(/\{\{mapUrl\}\}/g, googleMapsUrl)
      .replace(/\{\{closedEnvelopeImage\}\}/g, customClosedEnvelopeImage || CLOSED_ENVELOPE_DATA_URI)
      .replace(/\{\{openingVideo\}\}/g, customOpeningVideo || '/envelope_opening.mp4')
      .replace(
        /\{\{backgroundVideo\}\}/g,
        backgroundMediaType === 'video' ? customBackgroundVideo || '/hero-video.mp4' : ''
      )
      .replace(/\{\{backgroundImage\}\}/g, backgroundMediaType === 'image' ? customBackgroundImage : '');

    // Closed envelope image: use the admin's custom upload if one was set for this
    // template, otherwise fall back to instantly inlining the built-in default
    // (0 ms load time, no network latency).
    const envelopeReplacement = customClosedEnvelopeImage || CLOSED_ENVELOPE_DATA_URI;
    result = result
      .replace(/https:\/\/devetname-boy-girl\.vercel\.app\/acilmamis_devetname\.png/g, envelopeReplacement)
      .replace(/\/acilmamis_devetname\.webp/g, envelopeReplacement)
      .replace(/\/acilmamis_devetname\.png/g, envelopeReplacement)
      .replace(/onerror="this\.src='[^']+'"/g, '');

    return result;
  };

  const currentOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  const baseTag = currentOrigin ? `<base href="${currentOrigin}/">` : '';

  // If already a complete document, inject sanitized JS/CSS and replacements directly
  if (isCompleteDoc) {
    let fullDoc = replacePlaceholders(rawHtmlSanitized);

    // Inject base href so relative assets (/envelope_opening.mp4, /hero-video.mp4) resolve directly
    if (baseTag && !fullDoc.includes('<base ')) {
      if (fullDoc.includes('<head>')) {
        fullDoc = fullDoc.replace('<head>', `<head>\n  ${baseTag}`);
      } else if (fullDoc.includes('<head ')) {
        fullDoc = fullDoc.replace(/<head[^>]*>/, `$&\\n  ${baseTag}`);
      }
    }

    // Injected Wedding Data and InvitationApp Bridge
    const bridgeScript = `<script>
    // Injected Wedding Data
    window.WeddingData = ${JSON.stringify({
      brideName: invitation.brideName,
      groomName: invitation.groomName,
      weddingDate: invitation.weddingDate,
      weddingTime: invitation.weddingTime,
      venue: invitation.venue,
      address: invitation.address,
      contactPhone: invitation.contactPhone,
      formattedDate,
      mapUrl: googleMapsUrl,
      googleMapsUrl,
      wazeUrl,
      openingVideoSpeed,
      openingVideoTrimSeconds,
    })};

    // Standard RSVP & Action triggers for parent window integration
    window.InvitationApp = {
      openGoogleMaps: function() {
        window.open('${googleMapsUrl}', '_blank');
      },
      openWaze: function() {
        window.open('${wazeUrl}', '_blank');
      },
      openRSVP: function() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'OPEN_RSVP' }, '*');
        } else {
          var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
          if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
          var msg = encodeURIComponent("Salam! ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər!");
          window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
        }
      },
      rsvpYes: function() {
        var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
        if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
        var msg = encodeURIComponent("Salam! ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər!");
        window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
      },
      rsvpNo: function() {
        var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
        if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
        var msg = encodeURIComponent("Salam! Təəssüf ki, ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində iştirak edə bilməyəcəyəm. Sizə xoşbəxtlik arzulayıram!");
        window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
      },
      addToCalendar: function() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'ADD_TO_CALENDAR' }, '*');
        }
      },
      openMap: function() {
        window.open('${googleMapsUrl}', '_blank');
      },
      openWaze: function() {
        window.open('${wazeUrl}', '_blank');
      },
      shareWhatsApp: function() {
        var msg = encodeURIComponent("Dəvətnamə: " + window.location.href);
        window.open("https://wa.me/?text=" + msg, "_blank");
      }
    };
  </script>`;

    if (fullDoc.includes('<head>')) {
      fullDoc = fullDoc.replace('<head>', `<head>\n${bridgeScript}`);
    } else if (fullDoc.includes('<body>')) {
      fullDoc = fullDoc.replace('<body>', `<body>\n${bridgeScript}`);
    } else {
      fullDoc = bridgeScript + fullDoc;
    }

    // If extra CSS was provided in css tab, inject it before </head>
    const cssWithMediaOverride = (css || '') + backgroundImageOverrideCss + colorOverrideCss;
    if (cssWithMediaOverride && cssWithMediaOverride.trim()) {
      const extraStyleTag = `<style>\n/* Əlavə CSS Stilləri */\n${cssWithMediaOverride}\n</style>`;
      if (fullDoc.includes('</head>')) {
        fullDoc = fullDoc.replace('</head>', `${extraStyleTag}\n</head>`);
      } else {
        fullDoc = extraStyleTag + fullDoc;
      }
    }

    // If extra JS was provided, inject it before </body>
    const sanitizedJs = sanitizeCustomCode(js || '');
    if (sanitizedJs && sanitizedJs.trim()) {
      const extraScriptTag = `<script>\n// Əlavə JavaScript Məntiqi\n${sanitizedJs}\n</script>`;
      if (fullDoc.includes('</body>')) {
        fullDoc = fullDoc.replace('</body>', `${extraScriptTag}\n</body>`);
      } else {
        fullDoc = fullDoc + extraScriptTag;
      }
    }

    // Inject Anti-Theft Protection Guard into HTML document
    const antiTheftGuard = getAntiTheftIframeScript();
    if (fullDoc.includes('</body>')) {
      fullDoc = fullDoc.replace('</body>', `${antiTheftGuard}\n</body>`);
    } else {
      fullDoc = fullDoc + antiTheftGuard;
    }

    return minifyAndProtectHtml(fullDoc);
  }

  // Otherwise, construct standard HTML5 envelope
  const processedBody = replacePlaceholders(rawHtmlSanitized);
  const processedCss = replacePlaceholders((css || '') + backgroundImageOverrideCss + colorOverrideCss);
  const processedJs = sanitizeCustomCode(replacePlaceholders(js || ''));

  const standardHtml = `<!doctype html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${invitation.brideName || 'Gəlin'} & ${invitation.groomName || 'Bəy'} - Dəvətnamə</title>
  
  <!-- Fonts & Animations -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
  
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    ${processedCss}
  </style>
</head>
<body>
  ${processedBody}

  <script>
    // Injected Wedding Data
    window.WeddingData = ${JSON.stringify({
      brideName: invitation.brideName,
      groomName: invitation.groomName,
      weddingDate: invitation.weddingDate,
      weddingTime: invitation.weddingTime,
      venue: invitation.venue,
      address: invitation.address,
      contactPhone: invitation.contactPhone,
      formattedDate,
      mapUrl: googleMapsUrl,
      googleMapsUrl,
      wazeUrl,
      openingVideoSpeed,
      openingVideoTrimSeconds,
    })};

    // Standard RSVP & Action triggers for parent window integration
    window.InvitationApp = {
      openGoogleMaps: function() {
        window.open('${googleMapsUrl}', '_blank');
      },
      openWaze: function() {
        window.open('${wazeUrl}', '_blank');
      },
      openRSVP: function() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'OPEN_RSVP' }, '*');
        } else {
          var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
          if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
          var msg = encodeURIComponent("Salam! ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər!");
          window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
        }
      },
      rsvpYes: function() {
        var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
        if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
        var msg = encodeURIComponent("Salam! ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində böyük məmnuniyyətlə iştirak edəcəyəm. Təbriklər!");
        window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
      },
      rsvpNo: function() {
        var cleanPhone = '${(invitation.contactPhone || '994501234567').replace(/\D/g, '')}';
        if (cleanPhone.startsWith('0')) cleanPhone = '994' + cleanPhone.slice(1);
        var msg = encodeURIComponent("Salam! Təəssüf ki, ${invitation.groomName} və ${invitation.brideName}-in toy mərasimində iştirak edə bilməyəcəyəm. Sizə xoşbəxtlik arzulayıram!");
        window.open("https://wa.me/" + cleanPhone + "?text=" + msg, "_blank");
      },
      addToCalendar: function() {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'ADD_TO_CALENDAR' }, '*');
        }
      },
      openMap: function() {
        window.open('${googleMapsUrl}', '_blank');
      },
      openWaze: function() {
        window.open('${wazeUrl}', '_blank');
      },
      shareWhatsApp: function() {
        var msg = encodeURIComponent("Dəvətnamə: " + window.location.href);
        window.open("https://wa.me/?text=" + msg, "_blank");
      }
    };

    ${processedJs}
  </script>
  ${getAntiTheftIframeScript()}
</body>
</html>`;

  return minifyAndProtectHtml(standardHtml);
}
