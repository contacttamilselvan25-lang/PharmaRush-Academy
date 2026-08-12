let ctx = null;
let muted = false;

export function initAudio() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

export function setMuted(value) {
  muted = !!value;
}

export function resume() {
  if (ctx && ctx.state === "suspended") ctx.resume();
}

function tone(freq, start, dur, type = "sine", gainVal = 0.12) {
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainVal, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.02);
}

const SFX = {
  click() {
    tone(700, 0, 0.06, "square", 0.05);
  },
  correct() {
    tone(523, 0, 0.1, "sine", 0.12);
    tone(784, 0.09, 0.16, "sine", 0.12);
  },
  incorrect() {
    tone(220, 0, 0.2, "sawtooth", 0.08);
    tone(180, 0.15, 0.22, "sawtooth", 0.08);
  },
  reward() {
    tone(659, 0, 0.09, "triangle", 0.12);
    tone(880, 0.09, 0.09, "triangle", 0.12);
    tone(1318, 0.18, 0.2, "triangle", 0.12);
  },
  levelup() {
    tone(523, 0, 0.12, "triangle", 0.13);
    tone(659, 0.12, 0.12, "triangle", 0.13);
    tone(784, 0.24, 0.12, "triangle", 0.13);
    tone(1047, 0.36, 0.3, "triangle", 0.13);
  },
  achievement() {
    tone(880, 0, 0.12, "sine", 0.12);
    tone(1108, 0.14, 0.24, "sine", 0.12);
  },
  unlock() {
    tone(440, 0, 0.08, "sine", 0.1);
    tone(660, 0.1, 0.14, "sine", 0.1);
  },
};

export function play(name) {
  const fn = SFX[name];
  if (fn) {
    initAudio();
    resume();
    fn();
  }
}
