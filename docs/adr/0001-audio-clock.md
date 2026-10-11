# Audio clock and bounded charts

We use one synthesized AudioBuffer per route, scheduled on AudioContext.currentTime, with charts in seconds from the same epoch. This avoids drifting HTML audio and incremental JS timers. Pausing discards the current source and resumes from the stored audio offset; a generation token invalidates stale activation. A suspended or hidden page pauses instead of silently continuing. Browser scheduling and hardware latency remain outside numerical timing guarantees; calibration is an estimate, not physical measurement.
