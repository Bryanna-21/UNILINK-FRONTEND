// A two-tone siren made with the browser's own audio (no sound file to download or to go missing).
// Browsers refuse to play sound until the person has clicked or pressed something on the page, so
// start() says whether the sound is really playing; when it is not, the alert screen asks for a
// click and calls resume().
const TONES = [880, 660];
const TONE_MS = 450;
const MAX_MS = 60000; // never a siren that runs forever on an unattended screen

export function createAlarm({ AudioContextClass } = {}) {
  const Ctx =
    AudioContextClass ||
    (typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)) ||
    null;
  let ctx = null;
  let osc = null;
  let gain = null;
  let timer = null;
  let stopper = null;
  let wanted = false;

  const playing = () => !!ctx && ctx.state === "running" && !!osc;

  function build() {
    if (!Ctx) return false;
    if (!ctx) ctx = new Ctx();
    if (!osc) {
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      osc.type = "square";
      gain.gain.value = 0.08; // loud enough to notice, not a shock
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      let i = 0;
      osc.frequency.value = TONES[0];
      timer = setInterval(() => {
        i += 1;
        if (osc) osc.frequency.value = TONES[i % TONES.length];
      }, TONE_MS);
    }
    return true;
  }

  async function resume() {
    if (!wanted || !build()) return false;
    try {
      if (ctx.state !== "running") await ctx.resume();
    } catch (error) {
      return false;
    }
    return playing();
  }

  async function start() {
    wanted = true;
    if (stopper) clearTimeout(stopper);
    stopper = setTimeout(stop, MAX_MS);
    return resume();
  }

  function stop() {
    wanted = false;
    if (stopper) clearTimeout(stopper);
    if (timer) clearInterval(timer);
    stopper = null;
    timer = null;
    try {
      if (osc) osc.stop();
    } catch (error) {
      // already stopped
    }
    try {
      if (osc) osc.disconnect();
      if (gain) gain.disconnect();
    } catch (error) {
      // already disconnected
    }
    osc = null;
    gain = null;
    if (ctx && typeof ctx.close === "function") {
      ctx.close().catch(() => {});
    }
    ctx = null;
  }

  return { start, stop, resume, isSupported: !!Ctx };
}
