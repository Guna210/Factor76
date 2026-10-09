# Factor76

A cinematic private prototype for a prepared-meal service within Colombo city limits. Built with React, TypeScript, Vite, Three.js, GSAP, Lenis, and the HyperFrames player.

## Run locally

Use Node.js 22.12+ and pnpm.

```sh
pnpm install
pnpm dev
```

The development server prints its local URL, normally `http://127.0.0.1:5173`.

```sh
pnpm build
pnpm preview
```

The production build is emitted to `dist/`. It contains only static files and can be hosted on Cloudflare Workers Static Assets or Pages. No backend or API credentials are required to run it.

## What's included

- Procedural WebGL capsule with floating orbital sculpture, pointer parallax, and an animated opening/exploded view.
- Scroll-driven text reveals, smooth scrolling, animated abstract meal graphics, and an illustrative Colombo map.
- A 14-second deterministic HyperFrames launch composition that stays pinned, fully visible, and scroll-scrubbed in both directions. After the final frame, the page continues normally. Source: `public/film/`.
- Sample menu filters, accessible meal detail dialogs, and a working 4/6/8 meal box builder with local draft persistence, quantity limits, LKR subtotals, and a review-only final step.
- Mobile layouts, keyboard navigation, native modal focus containment, a motion toggle, reduced-motion support, and a WebGL fallback.
- Self-hosted fonts, no analytics, and no external runtime assets.

All meals, prices, nutritional figures, timing, and delivery information are illustrative. No payments, subscriptions, or actual orders are processed. Draft storage is limited to meal IDs and quantities in the visitor's browser.

## Private Cloudflare deployment

Wrangler is included. This checkout deliberately starts with `workers_dev: false` and `preview_urls: false`, and has no public domain route. This allows uploading a deployment before making it reachable.

1. Sign in locally: `pnpm exec wrangler login`.
2. Build and upload: `pnpm deploy`. At this point the Worker has no public route.
3. In **Workers & Pages → factor76 → Access**, choose **Protect this Worker behind Access**, select **All traffic**, and configure an Allow policy for the intended demo viewers. Enable Zero Trust first if the account asks for initial setup.
4. Verify that the protection applies to all production traffic. Then enable the Worker's `workers.dev` URL in the Cloudflare dashboard and set `workers_dev` to `true` in `wrangler.jsonc` so the setting persists on later deployments. Keep preview URLs disabled unless they are also protected.
5. Open the assigned URL in a signed-out browser and verify that authentication is required, then test access as an allowed viewer. A "private demo" label and `noindex` are presentation/search settings; Cloudflare Access provides the actual access restriction.

A custom domain is optional. If added later, keep the Worker-level All traffic Access policy in place. Do not enable a public route before the private policy exists.

Official references: [Workers Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/), [workers.dev routing](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/), [static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

## Editing

- Main content/layout: `src/App.tsx`, `src/styles.css`.
- Meal data: `src/data/meals.ts`.
- Box workflow: `src/components/BoxBuilder.tsx` and `.css`.
- 3D sculpture: `src/components/HeroScene.tsx`.
- Film: `public/film/index.html`, `film.css`, `timeline.js`; player wrapper in `src/components/LaunchFilm.tsx`.
- Font preparation: `scripts/fetch-fonts.mjs` downloads the Google Fonts assets into `public/fonts/`. These assets are already included; this is not part of normal installation or build.

The motion sequence runs as a live HyperFrames composition, with no visible media controls; its pinned timeline follows the user's scroll position in either direction. After it reaches the final frame, the pin releases and page scrolling continues. No MP4 export is needed by the website. For a standalone render, use the [official HyperFrames CLI](https://hyperframes.heygen.com/cli) against `public/film/index.html` with its relative assets retained.
