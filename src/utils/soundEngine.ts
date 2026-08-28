import { CharacterId } from '../types/game';

// Standard Vietnamese Voice Synthesizer & Web Audio Manager
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private currentAudioElement: HTMLAudioElement | null = null;
  private cachedViVoices: SpeechSynthesisVoice[] = [];
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private currentBgmType: string | null = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const voices = window.speechSynthesis.getVoices();
        this.cachedViVoices = voices.filter(
          (v) =>
            v.lang.toLowerCase().startsWith('vi') ||
            v.lang.toLowerCase().includes('viet') ||
            v.name.toLowerCase().includes('vietnam') ||
            v.name.toLowerCase().includes('tiếng việt') ||
            v.name.toLowerCase().includes('hoaimy') ||
            v.name.toLowerCase().includes('namminh')
        );
      };

      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
      this.stopSpeech();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.stopSpeech();
    }
  }

  public getVoiceEnabled() {
    return this.isVoiceEnabled;
  }

  // --- STANDARD VIETNAMESE VOICE ENGINE (GIỌNG ĐỌC CHUẨN TIẾNG VIỆT) ---
  public speakText(text: string, speaker: CharacterId) {
    if (this.isMuted || !this.isVoiceEnabled) return;
    this.stopSpeech();

    const cleanText = text.replace(/[*_#—–•⚡👑🔥⚔️🏆]/g, '').trim();
    if (!cleanText) return;

    // Strategy 1: Online Standard Vietnamese High-Definition Audio (Google Neural TTS)
    const onlineTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(
      cleanText
    )}`;

    const audio = new Audio(onlineTtsUrl);
    this.currentAudioElement = audio;

    // Tune playback rate per character
    if (speaker === 'ngo_quyen') {
      audio.playbackRate = 0.95; // Uy nghiêm, dõng dạc
    } else if (speaker === 'hoang_thao') {
      audio.playbackRate = 1.1; // Nhanh, ngạo mạn
    } else if (speaker === 'nguyen_tat_to') {
      audio.playbackRate = 1.05; // Dứt khoát
    } else {
      audio.playbackRate = 1.0;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If online audio fails (e.g. offline or cross-origin block), fallback to Native Browser SpeechSynthesis
        this.speakWithSpeechSynthesis(cleanText, speaker);
      });
    }
  }

  // Fallback Native SpeechSynthesis with optimized Vietnamese voice matching
  private speakWithSpeechSynthesis(cleanText: string, speaker: CharacterId) {
    if (!('speechSynthesis' in window)) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';

      // Pick best Vietnamese voice
      if (this.cachedViVoices.length === 0) {
        this.initVoices();
      }

      // Prioritize natural Vietnamese voices (HoaiMy, NamMinh, Google Tiếng Việt)
      const bestVoice =
        this.cachedViVoices.find(
          (v) =>
            v.name.includes('Natural') ||
            v.name.includes('HoaiMy') ||
            v.name.includes('NamMinh') ||
            v.name.includes('Google')
        ) || this.cachedViVoices[0];

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Character-specific Voice Tuning
      if (speaker === 'ngo_quyen') {
        utterance.pitch = 0.8;
        utterance.rate = 0.95;
      } else if (speaker === 'hoang_thao') {
        utterance.pitch = 1.25;
        utterance.rate = 1.1;
      } else if (speaker === 'nguyen_tat_to') {
        utterance.pitch = 0.95;
        utterance.rate = 1.1;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech error ignore
    }
  }

  public stopSpeech() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // --- SOUND EFFECTS (SFX) SYNTHESIZER ---
  public playSFX(
    type:
      | 'drum'
      | 'horn'
      | 'arrow'
      | 'splash'
      | 'victory'
      | 'clash'
      | 'wooden_crack'
      | 'fire'
      | 'battle_cry'
      | 'gong'
  ) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      switch (type) {
        case 'drum':
          this.playWarDrum();
          break;
        case 'horn':
          this.playWarHorn();
          break;
        case 'arrow':
          this.playArrowWhoosh();
          break;
        case 'splash':
          this.playWaterSplash();
          break;
        case 'wooden_crack':
          this.playWoodCrack();
          break;
        case 'victory':
          this.playVictoryFanfare();
          break;
        case 'clash':
          this.playWeaponClash();
          break;
        case 'fire':
          this.playFireWhoosh();
          break;
        case 'battle_cry':
          this.playBattleCry();
          break;
        case 'gong':
          this.playGong();
          break;
      }
    } catch {
      // Audio autoplay policy
    }
  }

  // War drum (Trống trận / Trống đồng)
  private playWarDrum() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // War horn (Tù và xuất trận)
  private playWarHorn() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(330, now + 0.3);
    osc2.frequency.setValueAtTime(222, now);
    osc2.frequency.exponentialRampToValueAtTime(333, now + 0.3);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);
  }

  // Fire whoosh (Tiếng lửa bùng cháy)
  private playFireWhoosh() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.2);
    filter.frequency.linearRampToValueAtTime(200, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Battle cry (Tiếng hô reo xung trận)
  private playBattleCry() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.6);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Gong (Tiếng cồng hiệu lệnh)
  private playGong() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 1.5);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // Arrow whoosh
  private playArrowWhoosh() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.25);
    filter.Q.setValueAtTime(5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Water splash
  private playWaterSplash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.linearRampToValueAtTime(120, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Wood crack
  private playWoodCrack() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Weapon clash
  private playWeaponClash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Victory fanfare
  private playVictoryFanfare() {
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392.0, 523.25];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0, now + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.45, now + idx * 0.14 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.14 + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.7);
    });
  }

  // BGM Synthesizer
  public playBGM(type: 'epic_war' | 'suspense' | 'victory' | 'calm') {
    if (this.isMuted) return;
    if (this.currentBgmType === type) return;

    this.stopBGM();
    this.currentBgmType = type;

    try {
      this.initContext();
      if (!this.ctx) return;

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      const freqs =
        type === 'victory'
          ? [130.81, 164.81, 196.0]
          : type === 'epic_war'
          ? [55.0, 110.0, 164.81]
          : [65.41, 98.0, 116.54];

      freqs.forEach((f) => {
        if (!this.ctx || !this.bgmGain) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        osc.connect(this.bgmGain);
        osc.start();
        this.bgmOscillators.push(osc);
      });
    } catch {
      // Audio autoplay
    }
  }

  public stopBGM() {
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    });
    this.bgmOscillators = [];
    this.currentBgmType = null;
  }
}

export const soundEngine = new SoundEngine();
