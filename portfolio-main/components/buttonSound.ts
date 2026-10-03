// Bencho UI tones. Presets and envelopes follow the Bencho sound library (MIT).
// https://bencho.dev/sounds?s=off
// https://bencho.dev/sounds?s=waft

type Tone = {
  atk?: number;
  cut?: number;
  gain: number;
  hz: number;
  ms: number;
  to?: number;
  wave: OscillatorType;
};

const OFF_TONE: Tone = {
  hz: 330,
  to: 247,
  ms: 88,
  gain: 0.03,
  wave: "sine",
  cut: 720,
  atk: 8
};

const WAFT_TONE: Tone = {
  hz: 344,
  ms: 345,
  gain: 0.046,
  wave: "triangle",
  cut: 1100,
  atk: 61
};

let audioContext: AudioContext | null = null;

function schedule(context: AudioContext, tone: Tone) {
  const start = context.currentTime;
  const end = start + tone.ms / 1000;
  const oscillator = context.createOscillator();
  oscillator.type = tone.wave;
  oscillator.frequency.setValueAtTime(tone.hz, start);

  if (tone.to) {
    oscillator.frequency.exponentialRampToValueAtTime(tone.to, end);
  }

  const gain = context.createGain();
  const attack = Math.min((tone.atk ?? 4) / 1000, (tone.ms / 1000) * 0.6);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(tone.gain, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  let output: AudioNode = oscillator;

  if (tone.cut) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = tone.cut;
    oscillator.connect(filter);
    output = filter;
  }

  output.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

function playTone(tone: Tone) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextCtor) {
    return;
  }

  audioContext ??= new AudioContextCtor();
  const context = audioContext;

  const play = () => {
    if (context.state === "running") {
      schedule(context, tone);
    }
  };

  if (context.state === "running") {
    play();
    return;
  }

  void context.resume().then(play);
}

export function playButtonSound() {
  playTone(OFF_TONE);
}

export function playToggleSound() {
  playTone(WAFT_TONE);
}
