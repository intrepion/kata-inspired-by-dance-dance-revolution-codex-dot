# Verification — 2026-10-11

## Automated numerical gates

16 public contract tests cover exact early/late judgment boundaries, ghost/repeated input, independent chord scoring, hold completion/early release/missed heads, tail deduplication, held lane plus separate head, terminal failure/release, all nine chart shapes and perfect maxima, calibration skips/duplicates/median/minimum samples, lifecycle generation invalidation, save round trips/malformed/future data/storage denial. Strict TypeScript and production build pass. Dependency audit: zero vulnerabilities. CI repeats typing/tests/build/audit.

The lifecycle token unit test alone does not prove UI wiring. Actual UI fault-injection checks below supplement it.

## Visible Mac Chrome gameplay

The user's installed Chrome loaded the detached production server. Route/difficulty/Start/Pause/Restart/Help/calibration controls were clicked through cua_repl. Full gameplay used clock-observed scheduled keyboard events through the normal key handlers, not an autoplay mode, engine calls, score mutations or clock acceleration. This is automated browser play, not human performance. `scripts/browser-play.js` records the schedule. Arrow direction, receptor/scroll visuals, HUD and results were inspected.

| Route | Local | Express | Night Shift |
| --- | --- | --- | --- |
| Copper Current | 30,000 / S / 30 perfect | 42,000 / S / 38 perfect + 4 holds | 58,000 / S / 55 perfect, 1 miss, 3 holds, 1 break (intentional) |
| Glass Junction | 30,000 / S | 42,000 / S / 4 holds | 60,000 / S / 4 holds |
| Afterhours Freight | 30,000 / S | 42,000 / S / 4 holds | 60,000 / S / 4 holds |

Nine charts contain 372 heads and 24 tails, with maximum two-head chords and no same-lane overlap. Each was played for its full normal duration. Numerical perfect input also clears every chart. Browser result JSON captures eight runs; Copper Local was verified by the visible 30,000-point/100% result. A delayed Copper Night Shift run produced 56 GOOD judgments, 4 holds, 26,400 points / D. A no-input run failed at zero energy / F; it did not replace the saved S record. Intentional misses/hold breaks reset combo and display feedback. Maximum score/combo and grade are checked in both numerical and browser scopes.

Trusted Chrome mouse input (CDP Input.dispatchMouseEvent at current pad coordinates) completed a hold for 2,000 points with HOLD feedback. An initial attempt used stale coordinates and missed; rerunning with fresh bounds succeeded. Physical touch was not tested.

## Lifecycle, calibration and saves

- Pause/resume, restarting countdown, route selection, Help modal and retry after insufficient calibration samples exercised through visible controls.
- `scripts/browser-audio-delay.js` delays the browser's actual AudioContext.resume promise. Starting then opening Help remained MENU after resolving activation; the same check passed for calibration. Pause → delayed Resume → Restart → resolve newer activation → resolve old activation retained the new countdown and live run. Fault injection cleared by reload.
- Actual AudioContext suspension paused gameplay; resuming recovered. Suspension during calibration cancelled to MENU with retry text. Synthetic window blur paused a fresh live run and resumed successfully. Browser automation routed native tab shortcuts without changing visibility, so an actual foreground/background tab transition was not independently verified.
- Calibration with skipped clicks 2 and 4 plus duplicate taps on the other clicks saved a +7 ms estimate. Numerical tests prove one sample per scheduled click, including skipped-click regressions. Calibration offset survived reload. The estimated offset is not a physical latency measurement.
- Records survived reload. Reduced-motion setting survived reload. Storage.setItem quota-denial injection showed the save warning; reload restored normal storage. Pure tests cover unavailable reads and malformed records.

## Visual QA and server

Screenshots in docs/screenshots: desktop, live chart/hold rail, paused chart, Night Shift results, 390px mobile and 320px mobile. Inspected screenshots revealed a cropped right pad at 320px even though document scrollWidth did not overflow. Fixed intrinsic button sizing and re-inspected: all four pads fit (each 57.25px wide). Desktop, 390×844 and 320×740 layouts checked; temporary viewport overrides reset. Console filtering to this app origin reported no application errors; unrelated installed Chrome extension errors/warnings were excluded.

Production server is detached, loopback-only, session-only, PID recorded locally in ignored .server.pid. HTTP 200 confirmed for root and built assets after detaching. Missing asset returns 404 and a subsequent root request stays 200. A rebuild initially exposed a server response-ordering bug; reading files before sending headers fixed it. Existing repositories and servers were preserved. No public deployment, boot/login autostart, security-setting changes or sidebar-registration claim.

## Independent reviews

Standards and specification reviews ran in separate subagents using fd86d63 as baseline. Initial reports are preserved in docs/REVIEW.md. Three substantive issues were fixed and re-reviewed: failed hold release awarding points/energy, pending activation under Help, and frozen calibration on audio interruption. Both follow-ups report no blockers. Spec reviewer independently ran all 16 tests. Neither reviewer independently repeated the browser runs.

## Limits

No actual audio listening, physical latency measurement, dance-pad, keyboard-rollover or physical touchscreen tests were performed. Synthesized buffer generation and scheduling were verified in the browser; perceived sound quality was not. Charts require at most two lanes; USB pads need keyboard mapping and no native gamepad integration exists. HTTP serving is required. One nonblocking architecture suggestion remains: separate lifecycle advancement from canvas drawing if this small app grows.
