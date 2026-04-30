import type { Context } from "@statico/zerodep-node-http-server";

export const indexRoute = async (c: Context) => {
  const installed = c.req.query("installed") === "1";

  const html = `
<!doctype html>
<html lang="en-us">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>news.ycombinator1.com — The 1 Manual</title>
    <meta name="description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />
    <link rel="apple-touch-icon" href="/favicon.png" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link rel="canonical" href="https://news.ycombinator1.com" />
    <meta property="og:site_name" content="news.ycombinator1.com" />
    <meta property="og:title" content="news.ycombinator1.com" />
    <meta property="og:url" content="https://news.ycombinator1.com" />
    <meta property="og:type" content="website" />
    <meta property="og:description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />
    <meta property="og:image" content="https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png" />
    <meta itemProp="name" content="news.ycombinator1.com" />
    <meta itemProp="description" content="Hacker News link preview service for Slack, Discord, Twitter, etc." />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,30..100;1,9..144,300..900,30..100&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
      rel="stylesheet"
    />

    <style>
      :root {
        --paper: #f5efe1;
        --paper-deep: #ece3cd;
        --ink: #1a1410;
        --ink-soft: #45382a;
        --ink-faded: #7a6a52;
        --rule: #1a1410;
        --orange: #ff6600;
        --orange-deep: #c24800;
        --cream-warn: #f7d9b5;
        --green: #2f6f3a;
        --green-soft: #d8e6c4;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: var(--paper);
        color: var(--ink);
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        font-weight: 400;
        font-size: 15px;
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        position: relative;
        overflow-x: hidden;
      }

      /* Paper grain + edge vignette */
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 1000;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        mix-blend-mode: multiply;
        opacity: 0.7;
      }
      body::after {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 1001;
        background: radial-gradient(
          ellipse at center,
          transparent 55%,
          rgba(26, 20, 16, 0.18) 100%
        );
      }

      ::selection {
        background: var(--orange);
        color: var(--paper);
      }

      a {
        color: var(--ink);
        text-decoration: none;
        background-image: linear-gradient(var(--orange), var(--orange));
        background-repeat: no-repeat;
        background-position: 0 100%;
        background-size: 100% 2px;
        transition: background-size 0.18s ease, color 0.18s ease;
        padding-bottom: 1px;
      }
      a:hover {
        background-size: 100% 100%;
        color: var(--paper);
      }

      code,
      .mono {
        font-family: "IBM Plex Mono", ui-monospace, monospace;
        background: var(--paper-deep);
        padding: 1px 6px;
        border-radius: 2px;
        font-size: 0.92em;
        font-weight: 500;
        border: 1px solid rgba(26, 20, 16, 0.08);
      }

      /* ── LAYOUT ─────────────────────────────────────── */

      .frame {
        max-width: 760px;
        margin: 0 auto;
        padding: 48px 28px 96px;
        position: relative;
      }

      @media (min-width: 720px) {
        .frame {
          padding: 64px 56px 120px;
        }
      }

      /* ── MASTHEAD ───────────────────────────────────── */

      .masthead {
        border-top: 4px double var(--rule);
        border-bottom: 4px double var(--rule);
        padding: 18px 0 14px;
        margin-bottom: 8px;
        position: relative;
      }

      .masthead-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-family: "IBM Plex Mono", monospace;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-faded);
        margin-bottom: 14px;
      }

      .masthead-row span + span::before {
        content: " · ";
        color: var(--ink-faded);
        margin: 0 6px;
      }

      .nameplate {
        font-family: "Fraunces", "Times New Roman", serif;
        font-variation-settings: "opsz" 144, "SOFT" 30;
        font-weight: 500;
        font-style: italic;
        font-size: clamp(40px, 8vw, 76px);
        line-height: 0.95;
        letter-spacing: -0.025em;
        color: var(--ink);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.18em;
        flex-wrap: wrap;
      }

      .nameplate .one {
        font-style: normal;
        font-weight: 700;
        color: var(--paper);
        background: var(--orange);
        padding: 0 0.18em;
        border-radius: 2px;
        font-variation-settings: "opsz" 144;
        transform: translateY(-0.04em) rotate(-2deg);
        display: inline-block;
        box-shadow: 4px 4px 0 var(--ink);
        animation: nudge 6s ease-in-out infinite;
      }

      @keyframes nudge {
        0%, 100% { transform: translateY(-0.04em) rotate(-2deg); }
        50%      { transform: translateY(-0.06em) rotate(-3deg); }
      }

      .nameplate .dot {
        color: var(--orange);
      }

      .subnameplate {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 14;
        font-style: italic;
        color: var(--ink-soft);
        font-size: 16px;
        margin: 14px 0 0;
        max-width: 56ch;
      }

      /* ── DISCLAIMER STAMP ───────────────────────────── */

      .stamp {
        margin: 26px 0 6px;
        border: 2px solid var(--orange-deep);
        color: var(--orange-deep);
        background: transparent;
        padding: 12px 18px;
        font-family: "IBM Plex Mono", monospace;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        line-height: 1.5;
        display: flex;
        align-items: center;
        gap: 14px;
        position: relative;
      }
      .stamp::before {
        content: "⚠";
        font-size: 18px;
        line-height: 1;
        flex-shrink: 0;
      }
      .stamp strong {
        font-weight: 600;
        color: var(--orange-deep);
        margin-right: 4px;
      }

      .installed {
        margin: 18px 0 0;
        background: var(--green-soft);
        border-left: 6px solid var(--green);
        padding: 14px 18px;
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 14;
        font-style: italic;
        color: var(--green);
        font-size: 16px;
      }

      /* ── SECTIONS ───────────────────────────────────── */

      .section {
        margin-top: 56px;
        position: relative;
      }

      .section-head {
        display: flex;
        align-items: baseline;
        gap: 16px;
        border-bottom: 1px solid var(--rule);
        padding-bottom: 10px;
        margin-bottom: 22px;
      }

      .section-num {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 14;
        font-style: italic;
        font-size: 14px;
        color: var(--orange-deep);
        letter-spacing: 0.04em;
        white-space: nowrap;
      }

      .section-title {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 60, "SOFT" 50;
        font-weight: 600;
        font-size: 28px;
        line-height: 1;
        margin: 0;
        letter-spacing: -0.01em;
      }

      .section-rule {
        flex: 1;
        height: 1px;
        background: repeating-linear-gradient(
          90deg,
          var(--ink-faded) 0 4px,
          transparent 4px 8px
        );
        align-self: center;
      }

      p {
        margin: 0 0 14px;
      }

      .lead {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 24;
        font-size: 19px;
        line-height: 1.5;
        color: var(--ink);
        margin-bottom: 18px;
      }

      .lead::first-letter {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 144, "SOFT" 100;
        font-weight: 700;
        font-style: normal;
        float: left;
        font-size: 4.6em;
        line-height: 0.82;
        padding: 6px 12px 0 0;
        margin-top: 4px;
        color: var(--orange);
      }

      .dinkus {
        text-align: center;
        margin: 28px 0;
        font-family: "Fraunces", serif;
        color: var(--ink-faded);
        letter-spacing: 1.2em;
        font-size: 14px;
        padding-left: 1.2em;
      }

      /* ── CTA / SLACK BUTTON ─────────────────────────── */

      .cta {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        margin: 28px 0 26px;
        padding: 30px 20px;
        background: var(--paper-deep);
        border: 1px solid var(--ink);
        position: relative;
      }
      .cta::before,
      .cta::after {
        content: "✦";
        position: absolute;
        top: -10px;
        background: var(--paper);
        padding: 0 8px;
        font-size: 14px;
        color: var(--orange);
      }
      .cta::before { left: 18px; }
      .cta::after  { right: 18px; }

      .cta-label {
        font-family: "IBM Plex Mono", monospace;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--ink-faded);
      }
      .cta a {
        background: none;
        padding: 0;
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .cta a:hover {
        transform: translateY(-2px) rotate(-1deg);
        color: inherit;
      }
      .cta img {
        display: block;
      }

      /* ── FIGURE / SCREENSHOTS ───────────────────────── */

      .fig {
        margin: 26px 0;
        display: block;
      }

      .fig-frame {
        background: white;
        border: 1px solid var(--ink);
        padding: 12px 12px 0;
        box-shadow: 6px 6px 0 var(--ink);
        max-width: 100%;
        display: inline-block;
      }

      .fig-frame img {
        display: block;
        max-width: 100%;
        height: auto;
      }

      .fig-caption {
        font-family: "Fraunces", serif;
        font-variation-settings: "opsz" 14;
        font-style: italic;
        font-size: 13.5px;
        color: var(--ink-soft);
        margin-top: 10px;
        padding-left: 18px;
        position: relative;
        max-width: 60ch;
      }
      .fig-caption::before {
        content: "↳";
        position: absolute;
        left: 0;
        color: var(--orange);
        font-style: normal;
      }
      .fig-caption .fig-num {
        font-family: "IBM Plex Mono", monospace;
        font-style: normal;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--orange-deep);
        margin-right: 8px;
      }

      .fig-row {
        display: flex;
        flex-wrap: wrap;
        gap: 22px;
        align-items: flex-start;
      }
      .fig-row .fig {
        flex: 1 1 280px;
        margin: 0;
      }

      /* ── PULL QUOTE / DEMO STRIP ────────────────────── */

      .demo-strip {
        margin: 32px 0;
        padding: 22px 24px;
        background: var(--ink);
        color: var(--paper);
        font-family: "IBM Plex Mono", monospace;
        font-size: 14px;
        line-height: 1.7;
        border-radius: 2px;
        position: relative;
        overflow: hidden;
      }
      .demo-strip::before {
        content: "$ ";
        color: var(--orange);
        font-weight: 600;
      }
      .demo-strip .arrow {
        color: var(--orange);
        margin: 0 10px;
        font-weight: 600;
      }
      .demo-strip .add {
        background: var(--orange);
        color: var(--ink);
        padding: 0 4px;
        font-weight: 600;
        animation: blink 1.4s steps(1, end) infinite;
      }
      @keyframes blink {
        0%, 50%   { opacity: 1; }
        51%, 100% { opacity: 0.55; }
      }

      /* ── FOOTER ─────────────────────────────────────── */

      footer {
        margin-top: 80px;
        padding-top: 22px;
        border-top: 4px double var(--rule);
        font-family: "IBM Plex Mono", monospace;
        font-size: 12px;
        color: var(--ink-faded);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 12px;
      }
      footer a {
        color: var(--ink-soft);
      }

      /* ── REVEAL ─────────────────────────────────────── */

      .reveal {
        animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
      }
      .reveal:nth-child(1) { animation-delay: 0.05s; }
      .reveal:nth-child(2) { animation-delay: 0.15s; }
      .reveal:nth-child(3) { animation-delay: 0.25s; }
      .reveal:nth-child(4) { animation-delay: 0.35s; }
      .reveal:nth-child(5) { animation-delay: 0.45s; }
      .reveal:nth-child(6) { animation-delay: 0.55s; }
      .reveal:nth-child(7) { animation-delay: 0.65s; }

      @keyframes rise {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    </style>
  </head>
  <body>
    <main class="frame">
      <header class="masthead reveal">
        <div class="masthead-row">
          <span>Vol. I · No. 1</span>
          <span>The 1 Manual</span>
          <span>est. MMXXII</span>
        </div>
        <h1 class="nameplate">
          news<span class="dot">.</span>ycombinator<span class="one">1</span><span class="dot">.</span>com
        </h1>
        <p class="subnameplate">
          A modest service that grants Hacker News links the dignity of a
          proper preview — on Slack, Discord, Twitter, Teams, and other
          places where naked URLs go to die.
        </p>
      </header>

      <div class="stamp reveal">
        <span><strong>Notice:</strong> Not affiliated with Y&nbsp;Combinator or Hacker News.</span>
      </div>

      ${
        installed
          ? `
      <div class="installed reveal">
        ✱ The HN Previews Slack App has been installed to your workspace. Enjoy.
      </div>
      `
          : ""
      }

      <section class="section reveal">
        <div class="section-head">
          <span class="section-num">§ 1</span>
          <h2 class="section-title">The Trick</h2>
          <span class="section-rule"></span>
        </div>
        <p class="lead">
          One small digit — inserted at exactly the right place in a Hacker
          News URL — turns a forgettable blue link into a rich card with a
          headline, a snippet, and an image. That digit is
          <code>1</code>, and that is the whole of it.
        </p>

        <div class="demo-strip">
          news.ycombinator<span class="add">1</span>.com/item?id=30167605 <span class="arrow">→</span> rich preview
        </div>

        <p>
          Read the original
          <a href="https://news.ycombinator.com/item?id=30181167">Hacker News announcement</a>
          for the long version, or carry on below for the short one.
        </p>

        <div class="dinkus">✦ ✦ ✦</div>
      </section>

      <section class="section reveal">
        <div class="section-head">
          <span class="section-num">§ 2</span>
          <h2 class="section-title">For Slack Users</h2>
          <span class="section-rule"></span>
        </div>
        <p>
          Install the official Slack app and every
          <code>news.ycombinator.com</code> link your team posts will be
          unfurled automatically — no rewriting, no copy-paste, no fuss.
        </p>

        <div class="cta">
          <div class="cta-label">— Install in one click —</div>
          <a href="https://slack.com/oauth/v2/authorize?client_id=124731001364.4852465343846&scope=links:read,links:write&user_scope=">
            <img
              alt="Add to Slack"
              height="40"
              width="139"
              src="https://platform.slack-edge.com/img/add_to_slack.png"
              srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
            />
          </a>
        </div>

        <figure class="fig">
          <span class="fig-frame">
            <img
              src="https://user-images.githubusercontent.com/137158/221394895-7a6a29a3-3685-4784-bf27-0746e79e19b5.png"
              alt="Slack unfurl with full preview"
              loading="lazy"
            />
          </span>
          <figcaption class="fig-caption">
            <span class="fig-num">Fig. 1</span>
            The Slack integration in its natural habitat — quietly converting plain links into legible cards.
          </figcaption>
        </figure>
      </section>

      <section class="section reveal">
        <div class="section-head">
          <span class="section-num">§ 3</span>
          <h2 class="section-title">For Everyone Else</h2>
          <span class="section-rule"></span>
        </div>
        <p>
          On Discord, Twitter, Teams, iMessage, Bluesky, or anywhere
          OpenGraph is honored, simply hand-edit the URL: insert a
          <code>1</code> after <code>ycombinator</code>. That is the entire
          interface.
        </p>
        <p>
          For instance,
          <code>https://news.ycombinator1.com/item?id=30167605</code>
          renders as a proper preview where the unmodified link would not.
        </p>

        <figure class="fig">
          <span class="fig-frame">
            <img
              src="https://user-images.githubusercontent.com/137158/152107529-4aef2e19-3761-4021-9530-e7830373a4b6.png"
              alt="Slack preview of a Hacker News story"
              loading="lazy"
            />
          </span>
          <figcaption class="fig-caption">
            <span class="fig-num">Fig. 2 · Slack</span>
            A submitted story, served with title, points, and discussion link.
          </figcaption>
        </figure>

        <figure class="fig">
          <span class="fig-frame">
            <img
              src="https://user-images.githubusercontent.com/137158/152107576-c8090184-93cc-4ccf-a5ec-81877081408f.png"
              alt="Slack preview of a Hacker News comment"
              loading="lazy"
            />
          </span>
          <figcaption class="fig-caption">
            <span class="fig-num">Fig. 3 · Slack, comment</span>
            Comments unfurl with author and excerpt — context that links alone refuse to provide.
          </figcaption>
        </figure>

        <figure class="fig">
          <span class="fig-frame">
            <img
              src="https://user-images.githubusercontent.com/137158/152107677-16301c32-bee1-41b0-8247-5d2bfbdf896b.png"
              alt="Discord preview"
              loading="lazy"
            />
          </span>
          <figcaption class="fig-caption">
            <span class="fig-num">Fig. 4 · Discord</span>
            Embedded inline, in Discord's native style.
          </figcaption>
        </figure>

        <figure class="fig">
          <span class="fig-frame">
            <img
              src="https://user-images.githubusercontent.com/137158/152107766-42a4f926-ee66-4d85-b48a-af14c1fb1c44.png"
              alt="Twitter preview"
              loading="lazy"
            />
          </span>
          <figcaption class="fig-caption">
            <span class="fig-num">Fig. 5 · Twitter / X</span>
            Twitter Cards, served just as the protocol intended.
          </figcaption>
        </figure>
      </section>

      <section class="section reveal">
        <div class="section-head">
          <span class="section-num">§ 4</span>
          <h2 class="section-title">Privacy, Plumbing &amp; Provenance</h2>
          <span class="section-rule"></span>
        </div>
        <p>
          The service is hosted on <a href="https://vercel.com/">Vercel</a> and
          powered by the
          <a href="https://github.com/HackerNews/API">official Hacker News API</a>.
          Source is on <a href="https://github.com/statico/ycombinator1.com">GitHub</a> —
          modest in size, modest in ambition.
        </p>
        <p>
          Requests pass through Vercel; logs persist for one hour as part of
          their free plan. Aggregate metrics — request counts, error codes —
          are kept longer but contain no personal data we can find.
        </p>
      </section>

      <footer class="reveal">
        <span>© news.ycombinator1.com</span>
        <span>Set in Fraunces &amp; IBM Plex Mono</span>
        <span><a href="https://github.com/statico/ycombinator1.com">View source ↗</a></span>
      </footer>
    </main>
  </body>
</html>
  `.trim();

  return c.html(html);
};
