// Decides whether the web alert should ring, and makes the sound. The decision is a pure function
// so it can be tested; the sound uses the browser's Web Audio (no audio file to host).

// Ring while any active alert has not been muted. Muting is per alert: a NEW SOS rings again
// even if an older one was muted.
export function shouldRing(alerts, mutedIds) {
  if (!Array.isArray(alerts) || alerts.length === 0) return false;
  const muted = mutedIds instanceof Set ? mutedIds : new Set(mutedIds || []);
  return alerts.some((a) => a && !muted.has(String(a._id)));
}

// Two quick alternating tones, about a second long. Returns false if the browser could not play it.
export function playSiren(ctx) {
  try {
    if (!ctx || ctx.state === "closed") return false;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "square";
    [880, 660, 880, 660].forEach((hz, i) => osc.frequency.setValueAtTime(hz, now + i * 0.25));
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 1.0);
    return true;
  } catch {
    return false;
  }
}
