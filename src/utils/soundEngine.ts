export type SFXType =
  | 'drum'
  | 'horn'
  | 'arrow'
  | 'splash'
  | 'waves'
  | 'wind'
  | 'horse'
  | 'victory'
  | 'clash'
  | 'wooden_crack'
  | 'fire'
  | 'battle_cry'
  | 'gong'
  | string;

export type BGMType = 'epic_war' | 'suspense' | 'victory' | 'calm' | string;

// 100% Real Fantasy & Custom SFX Engine
class SoundEngine {
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private currentVoiceAudio: HTMLAudioElement | null = null;
  private currentBgmAudio: HTMLAudioElement | null = null;
  private currentBgmType: string | null = null;
  private previewAudioElement: HTMLAudioElement | null = null;

  public unlockAudio() {
    try {
      const dummy = new Audio();
      dummy.play().catch(() => {});
    } catch {
      // Ignore
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
      this.stopSpeech();
      this.stopPreview();
    } else {
      if (this.currentBgmType) {
        const bgm = this.currentBgmType;
        this.currentBgmType = null;
        this.playBGM(bgm);
      }
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

  // --- 1. LỒNG TIẾNG CHUẨN TIẾNG VIỆT HOẶC CUSTOM VOICE ---
  public speakDialogue(dialogueId: string, customVoiceUrl?: string) {
    if (this.isMuted || !this.isVoiceEnabled) return;
    this.stopSpeech();

    try {
      const audioUrl = customVoiceUrl || `/assets/audio/voices/${dialogueId}.mp3`;
      const audio = new Audio(audioUrl);
      this.currentVoiceAudio = audio;
      audio.volume = 1.0;
      audio.playbackRate = 1.18;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[Voice] Auto-play prevented for ${dialogueId}:`, err);
        });
      }
    } catch (err) {
      console.error(`[Voice] Error playing voice for ${dialogueId}:`, err);
    }
  }

  public stopSpeech() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentVoiceAudio = null;
    }
  }

  // --- 2. HIỆU ỨNG ÂM THANH SFX (KHO GỐC + TÙY BIẾN) ---
  public playSFX(type: SFXType, customUrl?: string) {
    if (this.isMuted) return;

    try {
      let audioUrl = customUrl;
      if (!audioUrl) {
        let filename = type;
        if (type === 'splash') filename = 'waves';
        audioUrl = `/assets/audio/sfx/${filename}.ogg`;
      }

      const audio = new Audio(audioUrl);

      // Volume settings
      if (type === 'fire') {
        audio.volume = 0.55;
      } else if (type === 'waves' || type === 'wind') {
        audio.volume = 0.65;
      } else if (type === 'clash' || type === 'arrow') {
        audio.volume = 0.8;
      } else {
        audio.volume = 0.75;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!customUrl) {
            // Try mp3 extension fallback
            const fallbackAudio = new Audio(`/assets/audio/sfx/${type}.mp3`);
            fallbackAudio.volume = audio.volume;
            fallbackAudio.play().catch(() => {});
          }
        });
      }
    } catch (err) {
      console.warn(`[SFX] Could not play sfx ${type}:`, err);
    }
  }

  // --- 3. NHẠC NỀN & AMBIENT LOOPS BGM ---
  public playBGM(type: BGMType, customUrl?: string) {
    if (this.isMuted) return;
    if (this.currentBgmType === type && this.currentBgmAudio && !this.currentBgmAudio.paused) return;

    this.stopBGM();
    this.currentBgmType = type;

    try {
      const bgmUrl = customUrl || `/assets/audio/bgm/${type}.ogg`;
      const audio = new Audio(bgmUrl);
      this.currentBgmAudio = audio;
      audio.loop = true;
      audio.volume = 0.35;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (!customUrl) {
            const fallbackAudio = new Audio(`/assets/audio/bgm/${type}.mp3`);
            fallbackAudio.loop = true;
            fallbackAudio.volume = 0.35;
            this.currentBgmAudio = fallbackAudio;
            fallbackAudio.play().catch(() => {});
          }
        });
      }
    } catch (err) {
      console.warn(`[BGM] Could not play bgm ${type}:`, err);
    }
  }

  public stopBGM() {
    if (this.currentBgmAudio) {
      try {
        this.currentBgmAudio.pause();
        this.currentBgmAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentBgmAudio = null;
    }
    this.currentBgmType = null;
  }

  // --- 4. NGHE THỬ AUDIO CHO ADMIN EDITOR ---
  public previewAudio(url: string, onEnded?: () => void): () => void {
    this.stopPreview();
    if (!url) return () => {};

    try {
      const audio = new Audio(url);
      this.previewAudioElement = audio;
      audio.volume = 0.9;
      audio.onended = () => {
        this.previewAudioElement = null;
        if (onEnded) onEnded();
      };
      audio.play().catch((err) => {
        console.warn('Preview play error:', err);
        if (onEnded) onEnded();
      });

      return () => {
        audio.pause();
        audio.currentTime = 0;
        this.previewAudioElement = null;
      };
    } catch {
      return () => {};
    }
  }

  public stopPreview() {
    if (this.previewAudioElement) {
      try {
        this.previewAudioElement.pause();
        this.previewAudioElement.currentTime = 0;
      } catch {
        // Ignore
      }
      this.previewAudioElement = null;
    }
  }
}

export const soundEngine = new SoundEngine();
