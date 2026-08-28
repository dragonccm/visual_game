import { CharacterId } from '../types/game';

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
  | 'gong';

export type BGMType = 'epic_war' | 'suspense' | 'victory' | 'calm';

// 100% Real Audio Asset Engine (Loại bỏ hoàn toàn các âm thanh tổng hợp giả lập)
class SoundEngine {
  private isMuted: boolean = false;
  private isVoiceEnabled: boolean = true;
  private currentVoiceAudio: HTMLAudioElement | null = null;
  private currentBgmAudio: HTMLAudioElement | null = null;
  private currentBgmType: BGMType | null = null;

  public unlockAudio() {
    // Dummy audio touch to satisfy browser autoplay policy on initial interaction
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

  // --- 1. LỒNG TIẾNG THỰC TẾ 100% (STUDIO MP3 VOICES) ---
  public speakDialogue(dialogueId: string, _text?: string, _speaker?: CharacterId) {
    if (this.isMuted || !this.isVoiceEnabled) return;
    this.stopSpeech();

    try {
      const audioUrl = `/assets/audio/voices/${dialogueId}.mp3`;
      const audio = new Audio(audioUrl);
      this.currentVoiceAudio = audio;
      audio.volume = 1.0;

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

  // --- 2. HIỆU ỨNG ÂM THANH THỰC TẾ 100% (REAL SFX MP3 ASSETS) ---
  public playSFX(type: SFXType) {
    if (this.isMuted) return;

    try {
      let filename = type;
      if (type === 'splash') filename = 'waves'; // Map splash to real waves sound

      const sfxUrl = `/assets/audio/sfx/${filename}.mp3`;
      const audio = new Audio(sfxUrl);

      // Volume calibration
      if (type === 'horn') {
        audio.volume = 0.85;
      } else if (type === 'fire') {
        audio.volume = 0.6;
      } else if (type === 'gong') {
        audio.volume = 0.75;
      } else {
        audio.volume = 0.75;
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (err) {
      console.warn(`[SFX] Could not play sfx ${type}:`, err);
    }
  }

  // --- 3. NHẠC NỀN THỰC TẾ 100% (REAL BGM MP3 ASSETS) ---
  public playBGM(type: BGMType) {
    if (this.isMuted) return;
    if (this.currentBgmType === type && this.currentBgmAudio && !this.currentBgmAudio.paused) return;

    this.stopBGM();
    this.currentBgmType = type;

    try {
      const bgmUrl = `/assets/audio/bgm/${type}.mp3`;
      const audio = new Audio(bgmUrl);
      this.currentBgmAudio = audio;
      audio.loop = true;
      audio.volume = 0.28; // Subtle background ambience

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
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
}

export const soundEngine = new SoundEngine();
