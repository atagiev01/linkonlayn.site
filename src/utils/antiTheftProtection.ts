/**
 * Anti-Theft & Code Protection Utility
 * Provides multi-layer defense against code inspection, right-click, asset theft, and copying.
 */

export function getAntiTheftIframeScript(): string {
  return `<style id="__anti_theft_styles__">
  /* Disable text selection and dragging across the template */
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
    -webkit-touch-callout: none !important;
  }
  input, textarea, select, [contenteditable="true"] {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
  img, video, audio, source, svg {
    -webkit-user-drag: none !important;
    user-drag: none !important;
  }

  /* Anti-theft warning toast */
  #__security_toast__ {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    z-index: 999999;
    background: rgba(15, 15, 18, 0.94);
    border: 1px solid rgba(212, 175, 55, 0.6);
    color: #fef08a;
    padding: 10px 20px;
    border-radius: 9999px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 175, 55, 0.25);
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  #__security_toast__.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  #__devtools_block__ {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: rgba(10, 8, 6, 0.97);
    color: #f5ebd8;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  #__devtools_block__.show {
    display: flex;
  }
</style>

<div id="__security_toast__" aria-live="polite">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
  <span>Müəllif hüquqları qorunur. Kopyalama qadağandır.</span>
</div>

<div id="__devtools_block__">
  <div style="font-size:34px;margin-bottom:12px;">🔒</div>
  <div style="font-size:16px;font-weight:700;margin-bottom:6px;">Məzmun gizlədildi</div>
  <div style="font-size:13px;color:#c9b896;max-width:320px;">Tərtibatçı paneli (DevTools) açıqdır. Davam etmək üçün onu bağlayın.</div>
</div>

<script>
(function() {
  var toastTimer = null;
  function showWarningToast(msg) {
    var toast = document.getElementById('__security_toast__');
    if (!toast) return;
    if (msg) {
      var span = toast.querySelector('span');
      if (span) span.textContent = msg;
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2400);
  }

  // 1. Disable Right Click (Context Menu)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    showWarningToast('🔒 Müəllif hüquqları qorunur. Sağ klik qadağandır.');
    return false;
  }, true);

  // 2. Block Inspect & DevTools Shortcuts
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast('🔒 Tərtibatçı menyusu məhdudlaşdırılıb.');
      return false;
    }

    var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    var cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl+Shift+I / J / C (DevTools & Inspect)
    if (cmdOrCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast('🔒 Kodları incələmək qadağandır.');
      return false;
    }

    // Mac Cmd+Option+I / J / C / U
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast('🔒 Kodları incələmək qadağandır.');
      return false;
    }

    // Ctrl+U (View Source)
    if (cmdOrCtrl && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast('🔒 Mənbə kodunu açmaq qadağandır.');
      return false;
    }

    // Ctrl+S (Save Page)
    if (cmdOrCtrl && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      e.stopPropagation();
      showWarningToast('🔒 Səhifəni yadda saxlamaq qadağandır.');
      return false;
    }

    // Ctrl+A (Select All - allow only in input/textarea)
    if (cmdOrCtrl && (e.key === 'A' || e.key === 'a')) {
      var tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, true);

  // 3. Prevent Dragging of Images / Videos
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, true);

  // 4. Console Legal Security Banner
  try {
    var bannerTitle = 'color: #dc2626; font-size: 26px; font-weight: 900; text-shadow: 1px 1px 2px #000;';
    var bannerSubtitle = 'color: #f59e0b; font-size: 14px; font-weight: bold;';
    var bannerDesc = 'color: #a8a29e; font-size: 12px;';
    console.log('%cDAYANIN! / STOP!', bannerTitle);
    console.log('%cBu dəvətnamənin bütün interaktiv şablon kodları, vizual animasiyaları və dizayn elementləri müəllif hüquqları ilə tam qorunur.', bannerSubtitle);
    console.log('%cMənbə kodunun hər hansı formada kopyalanması, təkrar istifadəsi və ya kommersiya məqsədilə yayılması QƏTİ QADAĞANDIR! © 2026 Bütün Hüquqlar Qorunur.', bannerDesc);
  } catch(e) {}

  // 5. Detect DevTools Open (size gap + debugger timing trick) & block content
  var checkCount = 0;
  var consecutiveHits = 0;
  function showDevtoolsBlock() {
    var el = document.getElementById('__devtools_block__');
    if (el) el.classList.add('show');
  }
  function hideDevtoolsBlock() {
    var el = document.getElementById('__devtools_block__');
    if (el) el.classList.remove('show');
  }
  setInterval(function() {
    var widthDiff = window.outerWidth - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;
    var sizeSuspicious = widthDiff > 160 || heightDiff > 160;

    var timingSuspicious = false;
    var t0 = performance.now();
    debugger;
    var t1 = performance.now();
    if (t1 - t0 > 150) timingSuspicious = true;

    if (sizeSuspicious || timingSuspicious) {
      consecutiveHits++;
      // Require 2 consecutive positive checks so a single slow frame on an
      // older phone doesn't wrongly hide the invitation for a real guest.
      if (consecutiveHits >= 2) {
        showDevtoolsBlock();
        if (checkCount++ % 5 === 0) {
          try {
            console.clear();
            console.log('%c[TƏHLÜKƏSİZLİK]: Mənbə kodlarının mühafizəsi aktivdir.', 'color:#ef4444;font-weight:bold;font-size:14px;');
          } catch(err) {}
        }
      }
    } else {
      consecutiveHits = 0;
      hideDevtoolsBlock();
    }
  }, 900);
})();
</script>`;
}

/**
 * Minifies and scrambles comments out of custom HTML/CSS/JS so readable developer source is not exposed
 */
export function minifyAndProtectHtml(html: string): string {
  if (!html) return '';

  return html
    // Strip HTML comments (except conditional IE comments if any)
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
    // Strip multi-line CSS/JS comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Strip single line JS comments that are on their own lines
    .replace(/^\s*\/\/.*$/gm, '')
    // Condense redundant whitespace between tags
    .replace(/>\s{2,}</g, '><');
}

/**
 * React hook or initializer to attach window-level anti-theft guards
 */
export function attachWindowAntiTheftGuards(): () => void {
  if (typeof window === 'undefined') return () => {};

  // --- Toast (small warning bubble), built with plain DOM so it never
  // interferes with React's own tree ---
  let toastEl: HTMLDivElement | null = null;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  const showToast = (msg: string) => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('id', '__app_security_toast__');
      Object.assign(toastEl.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-16px)',
        zIndex: '999999',
        background: 'rgba(15,15,18,0.94)',
        border: '1px solid rgba(212,175,55,0.6)',
        color: '#fef08a',
        padding: '10px 18px',
        borderRadius: '9999px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
      });
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastEl.style.transform = 'translateX(-50%) translateY(0)';
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toastEl) {
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateX(-50%) translateY(-16px)';
      }
    }, 2200);
  };

  // --- CSS: block text selection + image/video dragging & long-press save ---
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', '__app_anti_theft_styles__');
  styleEl.textContent = `
    body.__anti-theft-active *:not(input):not(textarea):not([contenteditable="true"]) {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    body.__anti-theft-active img,
    body.__anti-theft-active video,
    body.__anti-theft-active audio,
    body.__anti-theft-active svg,
    body.__anti-theft-active source {
      -webkit-user-drag: none !important;
      user-drag: none !important;
      pointer-events: auto;
    }
  `;
  document.head.appendChild(styleEl);
  document.body.classList.add('__anti-theft-active');

  const handleContextMenu = (e: MouseEvent) => {
    // If user right-clicked inside an input/textarea in the app, allow it (copy/paste UX)
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    showToast('🔒 Sağ klik və şəkil/video yükləmə qadağandır');
  };

  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.tagName === 'SOURCE')) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      showToast('🔒 Tərtibatçı menyusu bağlıdır');
      return;
    }

    // Ctrl+Shift+I / J / C (Inspect)
    if (cmdOrCtrl && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
      e.preventDefault();
      showToast('🔒 Kodlara baxmaq qadağandır');
      return;
    }

    // Mac Cmd+Opt+I / J / C
    if (e.metaKey && e.altKey && ['I', 'i', 'J', 'j', 'C', 'c', 'U', 'u'].includes(e.key)) {
      e.preventDefault();
      showToast('🔒 Kodlara baxmaq qadağandır');
      return;
    }

    // Ctrl+U (View Source)
    if (cmdOrCtrl && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      showToast('🔒 Mənbə kodu bağlıdır');
      return;
    }

    // Ctrl+S (Save Page)
    if (cmdOrCtrl && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      showToast('🔒 Səhifəni yadda saxlamaq qadağandır');
      return;
    }
  };

  window.addEventListener('contextmenu', handleContextMenu, true);
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('dragstart', handleDragStart, true);

  // Console warning banner (shown once)
  try {
    console.log('%cDAYANIN!', 'color:#dc2626;font-size:26px;font-weight:900;');
    console.log(
      '%cBu saytın kodları, şəkilləri və dizaynı müəllif hüquqları ilə qorunur. Kopyalama qadağandır.',
      'color:#f59e0b;font-size:13px;font-weight:bold;'
    );
  } catch {
    /* no-op */
  }

  // --- Full-screen blocking overlay shown for as long as DevTools looks open ---
  let blockOverlay: HTMLDivElement | null = null;
  const showBlockOverlay = () => {
    if (blockOverlay) return;
    blockOverlay = document.createElement('div');
    blockOverlay.setAttribute('id', '__app_devtools_block__');
    Object.assign(blockOverlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      background: 'rgba(10,8,6,0.97)',
      color: '#f5ebd8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    });
    blockOverlay.innerHTML =
      '<div style="font-size:34px;margin-bottom:12px;">🔒</div>' +
      '<div style="font-size:16px;font-weight:700;margin-bottom:6px;">Məzmun gizlədildi</div>' +
      '<div style="font-size:13px;color:#c9b896;max-width:320px;">Tərtibatçı paneli (DevTools) açıqdır. Davam etmək üçün onu bağlayın.</div>';
    document.body.appendChild(blockOverlay);
  };
  const hideBlockOverlay = () => {
    if (blockOverlay) {
      blockOverlay.remove();
      blockOverlay = null;
    }
  };

  // Best-effort DevTools-open detection. Two independent heuristics are
  // combined so it also catches an UNDOCKED devtools window (which the
  // simple outerWidth/innerWidth gap check misses because the browser
  // window itself isn't resized in that case):
  //  1. window size gap (docked devtools)
  //  2. a debugger-statement timing trick (works even when undocked, since
  //     `debugger` pauses execution only while devtools is actually open)
  // Neither is bulletproof — this is a deterrent layer, not real DRM.
  let checkCount = 0;
  let consecutiveHits = 0;
  const devtoolsInterval = setInterval(() => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const sizeSuspicious = widthDiff > 160 || heightDiff > 160;

    let timingSuspicious = false;
    const t0 = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const t1 = performance.now();
    if (t1 - t0 > 150) timingSuspicious = true;

    if (sizeSuspicious || timingSuspicious) {
      consecutiveHits++;
      // Require 2 consecutive positive checks before blocking, so a single
      // slow frame / GC pause on an older phone doesn't wrongly hide the
      // invitation for a real guest.
      if (consecutiveHits >= 2) {
        showBlockOverlay();
        if (checkCount++ % 5 === 0) {
          try {
            console.clear();
            console.log('%c[TƏHLÜKƏSİZLİK]: Kodların mühafizəsi aktivdir.', 'color:#ef4444;font-weight:bold;font-size:14px;');
          } catch {
            /* no-op */
          }
        }
      }
    } else {
      consecutiveHits = 0;
      hideBlockOverlay();
    }
  }, 900);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, true);
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('dragstart', handleDragStart, true);
    clearInterval(devtoolsInterval);
    document.body.classList.remove('__anti-theft-active');
    styleEl.remove();
    if (toastEl) toastEl.remove();
    hideBlockOverlay();
  };
}
