export interface CustomStarter {
  id: string;
  name: string;
  category: 'classic' | 'floral' | 'luxury' | 'minimal' | 'modern' | 'custom';
  description: string;
  previewImage: string;
  html: string;
  css: string;
  js: string;
}

export const CUSTOM_TEMPLATE_STARTERS: CustomStarter[] = [
  {
    id: 'starter-video-envelope',
    name: 'Video Zərf & Parallax RSVP (Hərəkətli Dəvətnamə)',
    category: 'luxury',
    description: 'Açılan video zərf effekti, arxa fon video animasiyası, 3D Parallax RSVP kartı və WhatsApp inteqrasiyası.',
    previewImage: 'https://devetname-boy-girl.vercel.app/acilmamis_devetname.png',
    html: `<!doctype html>
<html lang="az">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <title>{{brideName}} & {{groomName}} - Dəvətnamə</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    />
    <style>
      * {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
        margin: 0;
        padding: 0;
      }
      body,
      html {
        width: 100%;
        height: 100%;
        background: var(--tpl-bg, #f4f2ee);
        font-family: "Cormorant Garamond", Georgia, serif;
        overflow: hidden;
        perspective: 1000px;
      }
      .invitation-card {
        width: 100%;
        height: 100dvh;
        margin: 0 auto;
        background: #fff;
        position: relative;
        overflow: hidden; /* Strict scroll-lock before envelope video opens */
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
        transform-style: preserve-3d;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .invitation-card.can-scroll {
        overflow-y: scroll !important;
      }
      .invitation-card::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
      .snap-section {
        width: 100%;
        height: 100dvh;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        position: relative;
        overflow: hidden;
      }
      .animated-element {
        opacity: 0;
      }
      #opening-screen {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: var(--tpl-bg, #f4f2ee);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
        visibility: visible;
        cursor: pointer;
        transition:
          opacity 0.8s ease,
          visibility 0.8s ease;
      }
      #opening-screen.fade-out {
        opacity: 0;
        visibility: hidden;
      }
      #invitation-picture {
        width: 100%;
        max-width: 430px;
        height: 100%;
        display: block;
      }
      #invitation {
        width: 100%;
        max-width: 430px;
        height: 100%;
        object-fit: cover;
        cursor: pointer;
        user-select: none;
        display: block;
      }
      #opening-video {
        display: none;
        width: 100%;
        max-width: 430px;
        height: 100%;
        object-fit: cover;
      }
      #main-invitation {
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      #main-invitation.fade-in {
        display: block;
        opacity: 1;
      }
      .hero-section {
        position: relative;
        width: 100%;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .hero-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      .hero-background video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(0.25) contrast(1.02);
      }
      .hero-overlay {
        position: absolute;
        inset: 0;
        background: rgba(20, 18, 16, 0.32);
      }
      .hero-content.image-style-theme {
        position: relative;
        z-index: 10;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 18px 18px;
        text-align: center;
        color: #f8f6f2;
      }
      .outer-gold-border {
        position: absolute;
        inset: 12px;
        border: 1px solid rgba(255, 255, 255, 0.28);
        pointer-events: none;
        z-index: 1;
      }
      .hero-top {
        position: relative;
        z-index: 2;
        margin-top: 8px;
      }
      .getting-married {
        font-family: "Jost", sans-serif;
        font-size: 11px;
        letter-spacing: 0.42em;
        color: #f2ede4;
        font-weight: 500;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .top-ornament {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .ornament-line {
        width: 34px;
        height: 1px;
        background: rgba(255, 255, 255, 0.4);
      }
      .ornament-icon {
        font-size: 6px;
        color: rgba(255, 255, 255, 0.55);
        letter-spacing: 0.3em;
      }
      .names {
        font-weight: 400;
        line-height: 1;
        margin: 0;
      }
      .name {
        display: block;
        font-family: "Playfair Display", serif;
        font-style: italic;
        font-weight: 500;
        font-size: clamp(48px, 11vw, 68px);
        color: #ffffff;
        letter-spacing: 0.01em;
      }
      .ampersand {
        display: block;
        font-family: "Cormorant Garamond", serif;
        font-size: 20px;
        font-style: italic;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.7);
        margin: 4px 0;
      }
      .quote-box {
        margin: 10px auto 0;
        padding: 10px 18px;
        width: fit-content;
        border-top: 1px solid rgba(255, 255, 255, 0.25);
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
        background: transparent;
      }
      .hero-bottom {
        position: relative;
        z-index: 2;
        margin-bottom: 8px;
      }
      .date-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: 8px;
      }
      .date-side {
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.3em;
        color: #f2ede4;
        font-weight: 500;
      }
      .date-divider {
        width: 1px;
        height: 16px;
        background: rgba(255, 255, 255, 0.35);
      }
      .waiting-text {
        font-family: "Cormorant Garamond", serif;
        font-style: italic;
        font-size: 22px;
        font-weight: 500;
        color: #ffffff;
        margin-top: 2px;
      }
      .decorative-heart {
        font-size: 8px;
        color: rgba(255, 255, 255, 0.5);
        margin: 8px 0;
      }
      .info-footer {
        font-family: "Jost", sans-serif;
        color: #f2ede4;
      }
      .time-location {
        font-size: 9px;
        letter-spacing: 0.22em;
        font-weight: 400;
        text-transform: uppercase;
      }
      @keyframes glow {
        from {
          opacity: 0.45;
        }
        to {
          opacity: 1;
        }
      }
      .glow-text {
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.85);
        text-align: center;
        animation: glow 1.8s ease-in-out infinite alternate;
      }
      .rsvp-button {
        position: relative;
        z-index: 10;
        width: 100%;
        border: 0;
        background: 0 0;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding-bottom: clamp(15px, 4vh, 25px);
        cursor: pointer;
      }
      .arrow {
        font-size: 15px;
        color: rgba(255, 255, 255, 0.75);
        animation: arrowMove 1.5s infinite ease-in-out;
      }
      @keyframes arrowMove {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(5px);
        }
      }
      #venue-section {
        background: var(--tpl-bg, #f4f2ee);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
      }
      .venue-card {
        width: 100%;
        max-width: 380px;
        background: #ffffff;
        border: 1px solid #e4e0d8;
        border-radius: 4px;
        padding: 40px 28px;
        text-align: center;
        box-shadow: 0 30px 60px rgba(20, 18, 16, 0.08);
        transform-style: preserve-3d;
        will-change: transform;
      }
      .venue-icon-wrapper {
        width: 40px;
        height: 40px;
        margin: 0 auto 14px;
        border-radius: 50%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--tpl-border, #d8d3c8);
        color: #6b6558;
      }
      .venue-pin-svg {
        width: 18px;
        height: 18px;
      }
      .venue-title-sub {
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.3em;
        color: var(--tpl-muted, #9a9282);
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .venue-title {
        font-family: "Playfair Display", serif;
        font-style: italic;
        font-weight: 500;
        font-size: clamp(26px, 6.5vw, 36px);
        color: var(--tpl-text, #211f1b);
        margin: 0 0 10px;
        line-height: 1.2;
      }
      .venue-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 16px;
      }
      .venue-line {
        width: 36px;
        height: 1px;
        background: var(--tpl-border, #d8d3c8);
      }
      .venue-heart {
        font-size: 5px;
        color: var(--tpl-muted, #9a9282);
      }
      .venue-address {
        font-family: "Cormorant Garamond", serif;
        font-size: 15px;
        color: #4a463d;
        line-height: 1.6;
        font-weight: 500;
        margin-bottom: 18px;
      }
      .venue-datetime-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: 1px solid var(--tpl-border, #d8d3c8);
        padding: 7px 18px;
        border-radius: 2px;
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.12em;
        font-weight: 500;
        color: var(--tpl-text, #211f1b);
        margin-bottom: 24px;
      }
      .venue-badge-sep {
        color: #b8b2a2;
      }
      .navigation-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 22px;
      }
      .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 14px 16px;
        border-radius: 2px;
        font-family: "Jost", sans-serif;
        font-size: 11px;
        letter-spacing: 0.14em;
        font-weight: 500;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;
      }
      .nav-btn:active {
        transform: scale(0.97);
      }
      .nav-btn-google {
        background: #ffffff;
        color: var(--tpl-text, #211f1b);
        border: 1px solid var(--tpl-text, #211f1b);
      }
      .nav-btn-google:hover {
        background: var(--tpl-text, #211f1b);
        color: #ffffff;
      }
      .nav-btn-waze {
        background: var(--tpl-text, #211f1b);
        color: #ffffff;
        border: 1px solid var(--tpl-text, #211f1b);
      }
      .nav-btn-waze:hover {
        background: #3a362e;
      }
      .nav-btn-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      .venue-next-btn {
        border: 0;
        background: 0 0;
        color: #6b6558;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        margin: 0 auto;
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.1em;
      }
      .venue-next-glow {
        color: var(--tpl-text, #211f1b);
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
      }
      .venue-next-arrow {
        color: var(--tpl-muted, #9a9282);
        font-size: 12px;
      }
      #rsvp-section {
        background: var(--tpl-bg, #f4f2ee);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
      }
      .rsvp-card {
        width: 100%;
        max-width: 380px;
        background: #ffffff;
        border: 1px solid #e4e0d8;
        border-radius: 4px;
        padding: 42px 28px;
        text-align: center;
        box-shadow: 0 30px 60px rgba(20, 18, 16, 0.08);
        transform-style: preserve-3d;
        will-change: transform;
      }
      .rsvp-title-sub {
        font-family: "Jost", sans-serif;
        font-size: 10px;
        letter-spacing: 0.35em;
        color: var(--tpl-muted, #9a9282);
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .rsvp-title {
        font-family: "Playfair Display", serif;
        font-style: italic;
        font-weight: 500;
        font-size: clamp(30px, 7vw, 38px);
        color: var(--tpl-text, #211f1b);
        margin: 0 0 12px;
      }
      .rsvp-desc {
        font-family: "Cormorant Garamond", serif;
        font-size: 16px;
        line-height: 1.5;
        color: #4a463d;
        margin: 0 auto 22px;
      }
      .submit-btn {
        width: 100%;
        padding: 14px;
        margin-top: 6px;
        border: none;
        background: var(--tpl-text, #211f1b);
        color: #fff;
        font-family: "Jost", sans-serif;
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-weight: 500;
        border-radius: 2px;
        cursor: pointer;
      }
      @media (min-width: 601px) {
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .invitation-card {
          max-width: 430px;
          height: 100vh;
          max-height: 930px;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        }
        #opening-screen {
          position: absolute;
          border-radius: 8px;
        }
      }

      /* Bottom Sound / Mute Toggle Button */
      .music-toggle-btn {
        display: none;
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(33, 31, 27, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: var(--tpl-bg, #f4f2ee);
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }
      .music-toggle-btn.visible {
        display: flex !important;
        animation: musicBtnFadeIn 0.5s ease-out forwards;
      }
      @keyframes musicBtnFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.85);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .music-toggle-btn:hover, .music-toggle-btn:active {
        transform: scale(1.08);
        background: var(--tpl-text, #211f1b);
        border-color: rgba(255, 255, 255, 0.45);
      }
      .music-toggle-btn.muted {
        border-color: rgba(255, 255, 255, 0.18);
        color: var(--tpl-muted, #9a9282);
        background: rgba(33, 31, 27, 0.7);
      }
      .music-icon {
        width: 19px;
        height: 19px;
        display: block;
      }
      .music-pulse-ring {
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.3);
        animation: musicPulse 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
        pointer-events: none;
      }
      .music-toggle-btn.muted .music-pulse-ring {
        display: none;
      }
      @keyframes musicPulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    </style>
  </head>
  <body>
    <div class="invitation-card" id="slider-container">
      <div id="opening-screen">
        <picture id="invitation-picture">
          <source srcset="/acilmamis_devetname.webp" type="image/webp" />
          <img
            id="invitation"
            src="/acilmamis_devetname.webp"
            alt="Dəvətnaməni aç"
            draggable="false"
          />
        </picture>
        <video
          id="opening-video"
          playsinline
          webkit-playsinline
          preload="auto"
          muted
          poster="/acilmamis_devetname.webp"
          disablepictureinpicture
          controlslist="nodownload nofullscreen noremoteplayback"
        >
          <source src="/envelope_opening.mp4" type="video/mp4" />
        </video>
      </div>
      <main id="main-invitation">
        <section class="snap-section hero-section">
          <div class="hero-background">
            <video
              id="hero-bg-video"
              loop
              muted
              playsinline
              webkit-playsinline
              preload="none"
            >
              <source src="/hero-video.mp4" type="video/mp4" />
            </video>
            <div class="hero-overlay"></div>
          </div>
          <div class="hero-content image-style-theme">
            <div class="outer-gold-border"></div>
            <div class="hero-top">
              <p
                class="getting-married animated-element"
                style="animation-delay: 0.2s"
              >
                Toyumuza Dəvətlisiniz
              </p>
              <div
                class="top-ornament animated-element"
                style="animation-delay: 0.4s"
              >
                <span class="ornament-line"></span
                ><span class="ornament-icon">•</span
                ><span class="ornament-line"></span>
              </div>
              <h1 class="names">
                <span
                  class="name animated-element"
                  style="animation-delay: 0.6s"
                  >{{groomName}}</span
                ><span
                  class="ampersand animated-element"
                  style="animation-delay: 0.8s"
                  >&amp;</span
                ><span class="name animated-element" style="animation-delay: 1s"
                  >{{brideName}}</span
                >
              </h1>
            </div>
            <div
              class="hero-bottom quote-box animated-element"
              style="animation-delay: 1.2s"
            >
              <div
                class="date-container animated-element"
                style="animation-delay: 1.4s"
              >
                <span class="date-side">{{weddingDay}}</span
                ><span class="date-divider"></span
                ><span class="date-side">{{weddingMonth}}</span
                ><span class="date-divider"></span
                ><span class="date-side">{{weddingYear}}</span>
              </div>
              <p
                class="waiting-text animated-element"
                style="animation-delay: 1.6s"
              >
                Sizi gözləyirik
              </p>
              <div
                class="decorative-heart animated-element"
                style="animation-delay: 1.8s"
              >
                •
              </div>
              <div
                class="info-footer animated-element"
                style="animation-delay: 2s"
              >
                <p class="time-location">{{weddingTime}} &nbsp;·&nbsp; {{venue}}</p>
              </div>
            </div>
          </div>
          <button
            class="rsvp-button animated-element"
            style="animation-delay: 2.2s"
            type="button"
            onclick="scrollToVenue()"
          >
            <span class="glow-text">Aşağı sürüşdürün</span
            ><span class="arrow">↓</span>
          </button>
        </section>
        <section class="snap-section" id="venue-section">
          <div class="venue-card" id="parallax-venue-card">
            <div class="venue-icon-wrapper animated-element">
              <svg
                class="venue-pin-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <p class="venue-title-sub animated-element" style="animation-delay: 0.2s">
              Mərasim Məkanı
            </p>
            <h2 class="venue-title animated-element" style="animation-delay: 0.4s">
              {{venue}}
            </h2>
            <div class="venue-divider animated-element" style="animation-delay: 0.5s">
              <span class="venue-line"></span>
              <span class="venue-heart">•</span>
              <span class="venue-line"></span>
            </div>
            <p class="venue-address animated-element" style="animation-delay: 0.6s">
              {{address}}
            </p>
            <div class="venue-datetime-badge animated-element" style="animation-delay: 0.8s">
              <span>{{weddingDay}} {{weddingMonth}}</span>
              <span class="venue-badge-sep">·</span>
              <span>{{weddingTime}}</span>
            </div>
            <div class="navigation-actions animated-element" style="animation-delay: 1s">
              <a
                class="nav-btn nav-btn-google"
                href="{{googleMapsUrl}}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="nav-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Google Xəritə</span>
              </a>
              <a
                class="nav-btn nav-btn-waze"
                href="{{wazeUrl}}"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="nav-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M5 17h14M7 17v2m10-2v2M5 17l1.2-6.2A3 3 0 0 1 9.14 8h5.72a3 3 0 0 1 2.94 2.8L19 17"
                  ></path>
                  <circle cx="8" cy="17" r="1.4"></circle>
                  <circle cx="16" cy="17" r="1.4"></circle>
                </svg>
                <span>Waze ilə Get</span>
              </a>
            </div>
            <button
              class="venue-next-btn animated-element"
              style="animation-delay: 1.2s"
              type="button"
              onclick="scrollToRSVP()"
            >
              <span class="venue-next-glow">RSVP-yə keç</span>
              <span class="venue-next-arrow">↓</span>
            </button>
          </div>
        </section>
        <section class="snap-section" id="rsvp-section">
          <div class="rsvp-card" id="parallax-rsvp-card">
            <p
              class="rsvp-title-sub animated-element"
              style="animation-delay: 0.2s"
            >
              R S V P
            </p>
            <h2
              class="rsvp-title animated-element"
              style="animation-delay: 0.4s"
            >
              Sizi gözləyirik
            </h2>
            <p class="rsvp-desc animated-element" style="animation-delay: 0.6s">
              {{customText}}
            </p>
            <div class="rsvp-buttons animated-element" style="animation-delay: 0.8s; display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
              <button
                type="button"
                class="submit-btn"
                style="display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;"
                onclick="window.InvitationApp && window.InvitationApp.rsvpYes ? window.InvitationApp.rsvpYes() : (window.parent && window.parent.postMessage({type: 'OPEN_RSVP'}, '*'))"
              >
                Bəli, Gələcəyəm
              </button>
              <button
                type="button"
                class="submit-btn"
                style="background: #ffffff; color: var(--tpl-text, #211f1b); border: 1px solid var(--tpl-border, #d8d3c8); font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;"
                onclick="window.InvitationApp && window.InvitationApp.rsvpNo ? window.InvitationApp.rsvpNo() : null"
              >
                Təəssüf ki, Gələ Bilmirəm
              </button>
            </div>

          </div>
        </section>
      </main>

      <!-- Background Wedding Music -->
      <audio id="bg-music" loop preload="auto">
        <source src="{{musicUrl}}" type="audio/mpeg" />
        <source src="/wedding-music.mp3" type="audio/mpeg" />
      </audio>

      <!-- Bottom Discreet Music Mute / Unmute Button -->
      <button
        id="music-toggle"
        type="button"
        class="music-toggle-btn"
        aria-label="Səsi aç və ya bağla"
        title="Səsi aç / bağla"
      >
        <!-- Sound On Icon (playing) -->
        <svg id="icon-sound-on" class="music-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <!-- Sound Off Icon (muted) -->
        <svg id="icon-sound-off" class="music-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
        <span class="music-pulse-ring"></span>
      </button>
    </div>
    <script>
      const openingScreen = document.getElementById("opening-screen");
      const invitationPicture = document.getElementById("invitation-picture");
      const invitation = document.getElementById("invitation");
      const openingVideo = document.getElementById("opening-video");
      const mainInvitation = document.getElementById("main-invitation");
      const heroBgVideo = document.getElementById("hero-bg-video");
      const rsvpCard = document.getElementById("parallax-rsvp-card");
      const venueCard = document.getElementById("parallax-venue-card");

      let isOpened = false;
      let isOpeningStarted = false;
      let videoSafetyTimer = null;

      function requestFullScreenMode() {
        try {
          if (window.self !== window.top) return; // Skip inside iframe
          const docEl = document.documentElement;
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(() => {});
          } else if (docEl.webkitRequestFullscreen) {
            try { docEl.webkitRequestFullscreen(); } catch (e) {}
          }
        } catch (e) {}
      }

      function handleOpenEnvelope(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        // Crucial: If already opened or already playing the opening video, IGNORE all subsequent taps!
        // This stops synthetic double-clicks, touchend+click duplication, or nervous taps from cutting the video!
        if (isOpened || isOpeningStarted) return;

        isOpeningStarted = true;
        requestFullScreenMode();

        // Start playing music immediately as the envelope video opens
        const bgMusic = document.getElementById("bg-music");
        if (bgMusic) {
          bgMusic.volume = 0.85;
          bgMusic.muted = false;
          const playAudioPromise = bgMusic.play();
          if (playAudioPromise !== undefined) {
            playAudioPromise.catch(function (err) {
              console.log("Audio playback notice:", err);
            });
          }
        }

        // Preload/prime the hero background video
        if (heroBgVideo) {
          try {
            heroBgVideo.load();
          } catch (e) {}
        }

        if (openingVideo) {
          if (invitationPicture) invitationPicture.style.display = "none";
          else if (invitation) invitation.style.display = "none";

          openingVideo.style.display = "block";
          openingVideo.muted = true;
          openingVideo.defaultMuted = true;
          openingVideo.currentTime = 0;
          var openingSpeed = (window.WeddingData && window.WeddingData.openingVideoSpeed) || 1.0;
          openingVideo.playbackRate = openingSpeed;

          let endedTriggered = false;
          function onVideoCompleted() {
            if (endedTriggered || isOpened) return;
            endedTriggered = true;
            if (videoSafetyTimer) {
              clearTimeout(videoSafetyTimer);
              videoSafetyTimer = null;
            }
            triggerOpenMain();
          }

          // 1. Primary completion trigger: native ended event
          openingVideo.onended = onVideoCompleted;

          // 2. Secondary completion trigger: timeupdate catches the end of
          // video (especially on iOS Safari) — OR the admin-configured trim
          // point, whichever comes first. This lets a long opening video be
          // "cut" short without re-exporting the file.
          var trimSeconds = window.WeddingData && window.WeddingData.openingVideoTrimSeconds;
          openingVideo.ontimeupdate = function () {
            if (trimSeconds && trimSeconds > 0 && openingVideo.currentTime >= trimSeconds) {
              onVideoCompleted();
              return;
            }
            if (openingVideo.duration && openingVideo.duration > 0) {
              if (openingVideo.currentTime >= openingVideo.duration - 0.12) {
                onVideoCompleted();
              }
            }
          };

          // 3. Fallback on error
          openingVideo.onerror = function () {
            console.warn("Envelope video error fallback");
            onVideoCompleted();
          };

          // 4. Generous safety fallback ONLY if video completely hangs/stalls.
          // Scaled by openingSpeed so a slower (<1x) opening video isn't
          // force-skipped before it actually finishes playing. If a trim
          // point is set, the safety window only needs to cover that.
          var effectiveMaxSeconds = trimSeconds && trimSeconds > 0 ? trimSeconds : 12;
          var safetyMs = Math.round((effectiveMaxSeconds * 1000 + 2000) / Math.min(openingSpeed, 1));
          videoSafetyTimer = setTimeout(() => {
            if (!isOpened) {
              console.log("Video safety fallback triggered");
              onVideoCompleted();
            }
          }, safetyMs);

          let playPromise = openingVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(function (err) {
              console.warn("Envelope video play catch:", err);
              // Wait briefly to see if playback resumes, else open main
              setTimeout(() => {
                if (!isOpened && openingVideo.paused && openingVideo.currentTime === 0) {
                  onVideoCompleted();
                }
              }, 800);
            });
          }
        } else {
          triggerOpenMain();
        }
      }

      function triggerOpenMain() {
        if (isOpened) return;
        isOpened = true;

        if (videoSafetyTimer) {
          clearTimeout(videoSafetyTimer);
          videoSafetyTimer = null;
        }

        mainInvitation.style.display = "block";

        // Play the hero video continuously in the background behind text
        if (heroBgVideo) {
          heroBgVideo.currentTime = 0;
          const playPromise = heroBgVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(function (err) {
              console.warn("Hero background video playback notice:", err);
            });
          }
        }

        const heroSection = document.querySelector(".hero-section");
        triggerAnimations(heroSection);

        // Unlock page scrolling only after video envelope has opened
        const sliderContainer = document.getElementById("slider-container");
        if (sliderContainer) {
          sliderContainer.classList.add("can-scroll");
          sliderContainer.scrollTop = 0;
        }

        setTimeout(() => {
          mainInvitation.classList.add("fade-in");
        }, 30);

        openingScreen.classList.add("fade-out");

        // Reveal bottom music mute/unmute icon when video envelope finishes opening
        const musicToggle = document.getElementById("music-toggle");
        if (musicToggle) {
          musicToggle.classList.add("visible");
        }

        setTimeout(() => {
          try {
            if (openingVideo) openingVideo.pause();
          } catch (e) {}
          openingScreen.style.display = "none";
        }, 800);
      }

      if (openingScreen) {
        openingScreen.addEventListener("click", handleOpenEnvelope);
        openingScreen.addEventListener("touchend", function (e) {
          handleOpenEnvelope(e);
        }, { passive: true });
      }

      // Guard against early scrolling before envelope video completes
      const sliderEl = document.getElementById("slider-container");
      if (sliderEl) {
        sliderEl.addEventListener("scroll", function () {
          if (!sliderEl.classList.contains("can-scroll")) {
            sliderEl.scrollTop = 0;
          }
        }, { passive: true });
      }

      // Music mute / unmute toggle listener
      const musicToggle = document.getElementById("music-toggle");
      const bgMusic = document.getElementById("bg-music");
      const iconSoundOn = document.getElementById("icon-sound-on");
      const iconSoundOff = document.getElementById("icon-sound-off");

      if (musicToggle && bgMusic) {
        musicToggle.addEventListener("click", function (e) {
          if (e && e.stopPropagation) e.stopPropagation();
          if (bgMusic.paused || bgMusic.muted) {
            bgMusic.muted = false;
            const p = bgMusic.play();
            if (p !== undefined) {
              p.then(() => {
                musicToggle.classList.remove("muted");
                if (iconSoundOn) iconSoundOn.style.display = "block";
                if (iconSoundOff) iconSoundOff.style.display = "none";
              }).catch(() => {});
            } else {
              musicToggle.classList.remove("muted");
              if (iconSoundOn) iconSoundOn.style.display = "block";
              if (iconSoundOff) iconSoundOff.style.display = "none";
            }
          } else {
            bgMusic.muted = true;
            musicToggle.classList.add("muted");
            if (iconSoundOn) iconSoundOn.style.display = "none";
            if (iconSoundOff) iconSoundOff.style.display = "block";
          }
        });
      }

      function triggerAnimations(container) {
        if (!container) return;
        const elements = container.querySelectorAll(".animated-element");
        elements.forEach((el) => {
          el.classList.add("animate__animated", "animate__fadeIn");
          el.style.opacity = "1";
        });
      }

      const sliderContainer = document.getElementById("slider-container");
      sliderContainer.addEventListener("scroll", function () {
        const rsvpSection = document.getElementById("rsvp-section");
        const rsvpRect = rsvpSection.getBoundingClientRect();

        if (rsvpRect.top >= 0 && rsvpRect.top < window.innerHeight / 2) {
          triggerAnimations(rsvpSection);
        }

        const venueSection = document.getElementById("venue-section");
        if (venueSection) {
          const venueRect = venueSection.getBoundingClientRect();
          if (venueRect.top >= 0 && venueRect.top < window.innerHeight / 2) {
            triggerAnimations(venueSection);
          }
        }
      });

      function scrollToRSVP() {
        document.getElementById("rsvp-section").scrollIntoView({
          behavior: "smooth",
        });
      }

      function scrollToVenue() {
        const venueSection = document.getElementById("venue-section");
        if (venueSection) {
          venueSection.scrollIntoView({ behavior: "smooth" });
        }
      }

      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let venueTargetX = 0, venueTargetY = 0;
      let venueCurrentX = 0, venueCurrentY = 0;

      if (rsvpCard) {
        rsvpCard.addEventListener("mousemove", (e) => {
          const rect = rsvpCard.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const percentX = (e.clientX - centerX) / (rect.width / 2);
          const percentY = (e.clientY - centerY) / (rect.height / 2);

          targetY = percentX * 15;
          targetX = -percentY * 15;
        });

        rsvpCard.addEventListener("mouseleave", () => {
          targetX = 0;
          targetY = 0;
        });
      }

      if (venueCard) {
        venueCard.addEventListener("mousemove", (e) => {
          const rect = venueCard.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const percentX = (e.clientX - centerX) / (rect.width / 2);
          const percentY = (e.clientY - centerY) / (rect.height / 2);

          venueTargetY = percentX * 12;
          venueTargetX = -percentY * 12;
        });

        venueCard.addEventListener("mouseleave", () => {
          venueTargetX = 0;
          venueTargetY = 0;
        });
      }

      function animateParallax() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        venueCurrentX += (venueTargetX - venueCurrentX) * 0.08;
        venueCurrentY += (venueTargetY - venueCurrentY) * 0.08;

        if (rsvpCard) {
          rsvpCard.style.transform = "rotateX(" + currentX.toFixed(2) + "deg) rotateY(" + currentY.toFixed(2) + "deg)";
        }
        if (venueCard) {
          venueCard.style.transform = "rotateX(" + venueCurrentX.toFixed(2) + "deg) rotateY(" + venueCurrentY.toFixed(2) + "deg)";
        }

        requestAnimationFrame(animateParallax);
      }
      animateParallax();
    </script>
  </body>
</html>`,
    css: ``,
    js: ``,
  },
  {
    id: 'starter-modern-gold',
    name: 'Modern Gold & Glass (HTML/CSS/JS)',
    category: 'luxury',
    description: 'Qızılı şüşə effektli kart, animasiyalı başlıq, canlı geri sayım və interaktiv RSVP düyməsi.',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    html: `<!-- DƏVƏTNAMƏ ƏSAS KONTENTİ -->
<div class="custom-invitation-card">
  <div class="top-ornament">✦ ✦ ✦</div>
  
  <p class="subtitle">BİRGƏLİKDƏ YENİ BİR HƏYATA İLK ADDIM</p>
  
  <h1 class="couple-names">
    <span class="name">{{brideName}}</span>
    <span class="ampersand">&</span>
    <span class="name">{{groomName}}</span>
  </h1>
  
  <div class="divider"></div>
  
  <p class="invitation-text">
    {{customText}}
  </p>
  
  <!-- TOY TARİXİ VƏ MƏKAN BLOKU -->
  <div class="details-grid">
    <div class="detail-box">
      <div class="box-icon">📅</div>
      <div class="box-title">TARİX VƏ SAAT</div>
      <div class="box-value">{{weddingDate}}</div>
      <div class="box-sub">{{weddingTime}}</div>
    </div>
    
    <div class="detail-box">
      <div class="box-icon">📍</div>
      <div class="box-title">MƏKAN</div>
      <div class="box-value">{{venue}}</div>
      <div class="box-sub">{{address}}</div>
    </div>
  </div>

  <!-- GERİ SAYIM TAYMERİ -->
  <div class="countdown-section">
    <h3 class="countdown-title">Mərasimə Qalan Vaxt</h3>
    <div class="timer-display" id="customCountdown">
      <div class="timer-box"><span id="days">00</span><label>Gün</label></div>
      <div class="timer-box"><span id="hours">00</span><label>Saat</label></div>
      <div class="timer-box"><span id="minutes">00</span><label>Dəqiqə</label></div>
      <div class="timer-box"><span id="seconds">00</span><label>Saniyə</label></div>
    </div>
  </div>

  <!-- HƏRƏKƏT DÜYMƏLƏRİ -->
  <div class="actions-wrapper">
    <button class="custom-btn btn-primary" onclick="window.InvitationApp.openRSVP()">
      <span>💌 İştirakı Təsdiq Et (RSVP)</span>
    </button>
    <button class="custom-btn btn-secondary" onclick="window.InvitationApp.addToCalendar()">
      <span>📅 Təqvimə Əlavə Et</span>
    </button>
    <button class="custom-btn btn-outline" onclick="window.InvitationApp.openMap()">
      <span>🗺️ Xəritədə Bax</span>
    </button>
    <button class="custom-btn btn-outline" onclick="window.InvitationApp.openWaze()">
      <span>🚗 Waze ilə Get</span>
    </button>
  </div>
  
  <div class="dress-code-box">
    <span>DRESS CODE:</span> {{dressCode}}
  </div>
</div>`,
    css: `/* ƏSAS FON VƏ ŞRİFTLƏR */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Plus+Jakarta+Sans:wght@300;400;600&display=swap');

.custom-template-wrapper {
  background: radial-gradient(circle at center, #1c1815 0%, #0c0b09 100%);
  min-height: 100vh;
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #f7f2e7;
}

.custom-invitation-card {
  max-width: 620px;
  width: 100%;
  background: rgba(28, 25, 23, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 155, 63, 0.35);
  border-radius: 28px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(200, 155, 63, 0.15);
  animation: cardFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.top-ornament {
  color: #d4af37;
  letter-spacing: 8px;
  font-size: 14px;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 11px;
  letter-spacing: 4px;
  color: #a8a29e;
  font-weight: 600;
  margin-bottom: 24px;
}

.couple-names {
  font-family: 'Cinzel', serif;
  font-size: 38px;
  font-weight: 700;
  color: #f6e05e;
  line-height: 1.2;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
}

.ampersand {
  display: block;
  font-size: 24px;
  color: #d4af37;
  margin: 6px 0;
  font-style: italic;
}

.divider {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  margin: 24px auto;
}

.invitation-text {
  font-size: 14px;
  line-height: 1.8;
  color: #e7e5e4;
  margin-bottom: 32px;
  font-style: italic;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

@media (max-width: 500px) {
  .details-grid { grid-template-columns: 1fr; }
}

.detail-box {
  background: rgba(12, 11, 9, 0.6);
  border: 1px solid rgba(200, 155, 63, 0.2);
  border-radius: 18px;
  padding: 18px;
  transition: all 0.3s ease;
}

.detail-box:hover {
  border-color: rgba(200, 155, 63, 0.6);
  transform: translateY(-2px);
}

.box-icon { font-size: 20px; margin-bottom: 6px; }
.box-title { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #d4af37; }
.box-value { font-size: 15px; font-weight: 600; color: #fff; margin-top: 4px; }
.box-sub { font-size: 12px; color: #a8a29e; margin-top: 2px; }

/* TAYMER */
.countdown-section {
  margin-bottom: 32px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

.countdown-title {
  font-size: 12px;
  letter-spacing: 2px;
  color: #a8a29e;
  margin-bottom: 14px;
  text-transform: uppercase;
}

.timer-display {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.timer-box {
  background: #171512;
  border: 1px solid rgba(200, 155, 63, 0.3);
  padding: 10px 14px;
  border-radius: 12px;
  min-width: 60px;
}

.timer-box span {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #f6e05e;
  font-family: monospace;
}

.timer-box label {
  font-size: 9px;
  color: #a8a29e;
  text-transform: uppercase;
}

/* DÜYMƏLƏR */
.actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.custom-btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #aa8010 100%);
  color: #0c0b09;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
}

.btn-secondary {
  background: #292524;
  color: #f5f5f4;
  border: 1px solid #44403c;
}

.btn-secondary:hover { background: #3c3836; }

.btn-outline {
  background: transparent;
  color: #d4af37;
  border: 1px solid rgba(212, 175, 55, 0.4);
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
}

.dress-code-box {
  font-size: 11px;
  color: #78716c;
  letter-spacing: 1px;
}
.dress-code-box span { color: #d4af37; font-weight: bold; }`,
    js: `// CANLI GERİ SAYIM HESABLANMASI
(function() {
  const weddingDateStr = window.WeddingData?.weddingDate || '2026-10-18';
  const targetDate = new Date(weddingDateStr + 'T18:00:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      const countdownEl = document.getElementById('customCountdown');
      if (countdownEl) countdownEl.innerHTML = '<p style="color:#d4af37;font-weight:bold;">Təntənəli Mərasim Günü Çatdı! 🎉</p>';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.innerText = d < 10 ? '0' + d : d;
    if (hEl) hEl.innerText = h < 10 ? '0' + h : h;
    if (mEl) mEl.innerText = m < 10 ? '0' + m : m;
    if (sEl) sEl.innerText = s < 10 ? '0' + s : s;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
  console.log('Modern Gold Custom Template JS initialized successfully!');
})();`,
  },
  {
    id: 'starter-floral-watercolor',
    name: 'Romantik Gül & Akvarel (HTML/CSS/JS)',
    category: 'floral',
    description: 'Zərif çəhrayı və pastel tonlar, xəttatlıq şriftləri və romantik gül vizualları.',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    html: `<div class="floral-card">
  <div class="floral-header">
    <div class="flower-icon">🌸</div>
    <span class="save-the-date">SAVE THE DATE</span>
  </div>

  <h1 class="couple-names-floral">
    {{brideName}} <span class="heart-symbol">♥</span> {{groomName}}
  </h1>

  <p class="parents-names">
    {{brideParents}} & {{groomParents}}
  </p>

  <div class="floral-quote">
    "{{customText}}"
  </div>

  <div class="date-badge">
    <span class="day-text">{{weddingDate}}</span>
    <span class="time-text">Saat: {{weddingTime}}</span>
  </div>

  <div class="venue-info">
    <h3>{{venue}}</h3>
    <p>{{address}}</p>
  </div>

  <div class="floral-actions">
    <button class="btn-floral-rsvp" onclick="window.InvitationApp.openRSVP()">
      🌹 İştirakını Təsdiq Et (RSVP)
    </button>
    <div class="sub-actions">
      <button onclick="window.InvitationApp.addToCalendar()">📅 Təqvim</button>
      <button onclick="window.InvitationApp.openMap()">📍 Xəritə</button>
      <button onclick="window.InvitationApp.openWaze()">🚗 Waze</button>
      <button onclick="window.InvitationApp.shareWhatsApp()">💬 WhatsApp</button>
    </div>
  </div>
</div>`,
    css: `@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;600&display=swap');

.custom-template-wrapper {
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  min-height: 100vh;
  padding: 30px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  color: #4a4a4a;
}

.floral-card {
  max-width: 580px;
  width: 100%;
  background: #ffffff;
  border-radius: 30px;
  padding: 45px 30px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(224, 122, 95, 0.12);
  border: 2px solid #fceeed;
}

.flower-icon { font-size: 32px; margin-bottom: 6px; }

.save-the-date {
  font-size: 11px;
  letter-spacing: 5px;
  color: #e07a5f;
  font-weight: 600;
}

.couple-names-floral {
  font-family: 'Great Vibes', cursive;
  font-size: 46px;
  color: #c95d40;
  margin: 20px 0 10px;
}

.heart-symbol {
  font-size: 26px;
  color: #e07a5f;
  vertical-align: middle;
}

.parents-names {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 20px;
}

.floral-quote {
  font-style: italic;
  font-size: 13px;
  line-height: 1.8;
  color: #666;
  margin: 20px 0;
  padding: 15px;
  background: #fff8f7;
  border-radius: 16px;
}

.date-badge {
  background: #fdf0ed;
  color: #c95d40;
  padding: 16px;
  border-radius: 20px;
  margin: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-text { font-size: 18px; font-weight: 700; }
.time-text { font-size: 12px; color: #888; }

.venue-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.venue-info p {
  font-size: 12px;
  color: #777;
  margin-bottom: 25px;
}

.btn-floral-rsvp {
  width: 100%;
  background: #e07a5f;
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(224, 122, 95, 0.3);
  transition: all 0.2s;
}

.btn-floral-rsvp:hover {
  background: #c95d40;
  transform: translateY(-2px);
}

.sub-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.sub-actions button {
  flex: 1;
  background: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  color: #555;
}

.sub-actions button:hover { background: #eee; }`,
    js: `console.log("Romantik Gül & Akvarel şablonu aktivləşdirildi!");`,
  },
  {
    id: 'starter-scratch-custom',
    name: 'Təmiz Boş Şablon (HTML/CSS/JS)',
    category: 'custom',
    description: 'Sıfırdan öz dizaynınızı HTML, CSS və JavaScript ilə yazmaq üçün təmiz şablon.',
    previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    html: `<div class="scratch-template">
  <!-- DƏVƏTNAMƏ BAŞLIĞI -->
  <header>
    <h1>{{brideName}} & {{groomName}}</h1>
    <p class="date">{{weddingDate}} • {{weddingTime}}</p>
  </header>

  <!-- ƏSAS MƏTN -->
  <section class="content">
    <p>{{customText}}</p>
  </section>

  <!-- MƏKAN VƏ ÜNVAN -->
  <section class="location">
    <h3>{{venue}}</h3>
    <p>{{address}}</p>
  </section>

  <!-- DÜYMƏLƏR -->
  <div class="button-group">
    <button onclick="window.InvitationApp.openRSVP()">RSVP Qonaq Təsdiqi</button>
    <button onclick="window.InvitationApp.addToCalendar()">Təqvimə Yaz</button>
  </div>
</div>`,
    css: `.custom-template-wrapper {
  background: #111;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #eee;
  font-family: sans-serif;
}

.scratch-template {
  max-width: 500px;
  width: 100%;
  background: #1e1e1e;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #333;
  text-align: center;
}

.scratch-template h1 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #f59e0b;
}

.scratch-template .date {
  color: #aaa;
  font-size: 13px;
  margin-bottom: 20px;
}

.scratch-template .content {
  margin: 20px 0;
  line-height: 1.6;
  font-size: 14px;
}

.scratch-template .location {
  margin: 20px 0;
  padding: 15px;
  background: #252525;
  border-radius: 10px;
}

.scratch-template .button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.scratch-template button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #f59e0b;
  color: #000;
  font-weight: bold;
  cursor: pointer;
}`,
    js: `// Fərdi JavaScript kodlarınızı bura yaza bilərsiniz
console.log("Xoş gəlmisiniz! Dəvətnamə məlumatları:", window.WeddingData);`,
  },
];
