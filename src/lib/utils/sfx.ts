class AudioPlayer {
  private ctx: AudioContext | null = null;
  private lastSwoosh: number = 0;
  private lastScroll: number = 0;

  private getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  // Explicitly called on first user interaction to unlock audio
  init() {
    const ctx = this.getCtx();
    if (ctx) {
      // Play a silent 1ms buffer to force unlocking on iOS/Safari
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
    }
  }

  playHover() {
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } catch (_) {}
  }

  playClick() {
    const ctx = this.getCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  playScroll() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = Date.now();
    if (now - this.lastScroll < 150) return; // Throttle scroll sound
    this.lastScroll = now;

    try {
      const bufferSize = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.3;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800; // slightly lower rumbling

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // Increased volume of scroll
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      source.start();
    } catch (_) {}
  }

  playSwoosh(intensity: number) {
    const ctx = this.getCtx();
    if (!ctx) return;

    const now = Date.now();
    if (now - this.lastSwoosh < 150) return; // Prevent spamming
    this.lastSwoosh = now;

    try {
      const duration = 0.35;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      // Sharper wind based on how fast they move
      filter.frequency.setValueAtTime(500 + intensity * 1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

      const gain = ctx.createGain();
      // True swoosh envelope: quick fade up, sweeping fade out
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08 + 0.12 * intensity, ctx.currentTime + 0.05); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // Decay

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(ctx.currentTime);
    } catch (_) {}
  }
}

export const sfx = new AudioPlayer();
