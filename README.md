# Switchyard

An original four-arrow browser rhythm arcade: copper signals, mint rails, three synthesized electronic routes, nine charts. All music, patterns and visuals are original. Inspired by the directional arcade rhythm format; no commercial assets.

## Play locally

```sh
npm ci
npm run build
node scripts/launch.mjs
```

Open http://127.0.0.1:5197. The launcher is detached for this session only, bound to loopback, and refuses occupied ports. No boot/login autostart. To restart only this game's server, check `.server.pid` belongs to `node scripts/serve.mjs`, stop that PID, then run `node scripts/launch.mjs`. Use `PORT=5198 node scripts/launch.mjs` if 5197 is occupied; never stop another project's server. For development: `npm run dev` on a free port (or `npx vite --host 127.0.0.1 --port <free-port> --strictPort`). Served HTTP is required; this Vite app is not a double-click file build.

Arrow keys or D/F/J/K, or press/hold the four pads. Escape pauses. Hold rails through their tails; chords need two directions. Three levels increase density and add holds/chords. All songs are unlocked. Best successful score per chart and settings save locally; failures do not replace records. Calibrate with 12 clicks and one Space/panel tap per click; at least six samples required. Tutorial contains score and judgment details.

## Checks

`npm run check` runs strict typing, numerical contract tests and production build. `npm audit --audit-level=moderate` audits development dependencies. GitHub Actions repeats these gates on every push. Browser QA and independent review findings are recorded in `docs/QA.md`. `scripts/browser-play.js` is the reproducible simulated-input schedule used in the visible Mac Chrome tab; it does not write scores or adjust the game clock.

## Timing and device limits

Chart input/render/audio share AudioContext.currentTime. The music is generated into a buffer and scheduled with 80 ms startup safety and two seconds of count-in. A stale asynchronous activation cannot overwrite a newer run. Pause reconstructs audio from the stored offset; active holds break on pause. Visibility/focus loss and audio suspension interrupt play. Scheduling avoids JS audio timers, but input, paint and output latency still depend on browser and hardware. ±200 ms manual/median calibration is an estimate. Wired audio is recommended. No physical latency measurement or actual audio listening was performed in automated QA.

Charts require at most two directions at once; keyboard rollover is hardware dependent. A dance pad must emit keyboard arrows; native USB/gamepad protocols are not supported. Pointer capture supports mouse/touch holds and cancels release them; physical touch and dance pads were not tested. Storage-denied mode remains playable with a visible save warning. No runtime network requests, paid services or public deployment.
