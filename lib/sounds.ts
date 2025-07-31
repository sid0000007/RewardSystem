import { RewardType, ActionType } from '@/types';

// Sound effect configuration
interface SoundConfig {
  src: string;
  volume: number;
  preload: boolean;
}

// Sound mappings for different events
const SOUND_EFFECTS: Record<string, SoundConfig> = {
  // Reward collection sounds by rarity
  'reward-common': {
    src: '/sounds/coin-collect.mp3',
    volume: 0.3,
    preload: true
  },
  'reward-rare': {
    src: '/sounds/chime-success.mp3',
    volume: 0.4,
    preload: true
  },
  'reward-epic': {
    src: '/sounds/magic-sparkle.mp3',
    volume: 0.5,
    preload: true
  },
  'reward-legendary': {
    src: '/sounds/fanfare-victory.mp3',
    volume: 0.6,
    preload: true
  },
  'reward-special': {
    src: '/sounds/crystal-chime.mp3',
    volume: 0.5,
    preload: true
  },
  
  // Action sounds
  'scan-success': {
    src: '/sounds/beep-scan.mp3',
    volume: 0.3,
    preload: true
  },
  'scan-error': {
    src: '/sounds/error-buzz.mp3',
    volume: 0.2,
    preload: true
  },
  'video-complete': {
    src: '/sounds/video-complete.mp3',
    volume: 0.4,
    preload: true
  },
  'checkin-success': {
    src: '/sounds/location-ping.mp3',
    volume: 0.4,
    preload: true
  },
  
  // UI feedback sounds
  'button-click': {
    src: '/sounds/click-soft.mp3',
    volume: 0.2,
    preload: false
  },
  'tab-switch': {
    src: '/sounds/whoosh-light.mp3',
    volume: 0.1,
    preload: false
  },
  'achievement-unlock': {
    src: '/sounds/achievement-bell.mp3',
    volume: 0.5,
    preload: true
  },
  'streak-bonus': {
    src: '/sounds/bonus-ding.mp3',
    volume: 0.4,
    preload: true
  }
};

// Fallback sounds using Web Audio API for when audio files aren't available
const generateTone = (frequency: number, duration: number, volume: number = 0.1): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      setTimeout(() => {
        resolve();
      }, duration * 1000);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      resolve();
    }
  });
};

// Fallback sound mappings using generated tones
const FALLBACK_SOUNDS: Record<string, { frequency: number; duration: number; volume: number }> = {
  'reward-common': { frequency: 523, duration: 0.2, volume: 0.1 }, // C5
  'reward-rare': { frequency: 659, duration: 0.3, volume: 0.15 }, // E5
  'reward-epic': { frequency: 784, duration: 0.4, volume: 0.2 }, // G5
  'reward-legendary': { frequency: 1047, duration: 0.6, volume: 0.25 }, // C6
  'reward-special': { frequency: 880, duration: 0.5, volume: 0.2 }, // A5
  'scan-success': { frequency: 800, duration: 0.1, volume: 0.1 },
  'scan-error': { frequency: 200, duration: 0.3, volume: 0.1 },
  'video-complete': { frequency: 600, duration: 0.2, volume: 0.1 },
  'checkin-success': { frequency: 700, duration: 0.2, volume: 0.1 },
  'button-click': { frequency: 400, duration: 0.05, volume: 0.05 },
  'achievement-unlock': { frequency: 1200, duration: 0.4, volume: 0.15 },
  'streak-bonus': { frequency: 900, duration: 0.3, volume: 0.1 }
};

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private masterVolume: number = 1.0;
  private useWebAudio: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Check if audio files are available, otherwise use Web Audio API
    this.checkAudioAvailability();
    
    // Preload commonly used sounds
    this.preloadSounds();
    
    // Listen for user preference changes
    this.setupPreferenceListener();
  }

  private async checkAudioAvailability() {
    // Only run on client side
    if (typeof window === 'undefined') {
      this.useWebAudio = true;
      return;
    }
    
    try {
      const testAudio = new Audio();
      testAudio.src = SOUND_EFFECTS['reward-common'].src;
      
      await new Promise((resolve, reject) => {
        testAudio.addEventListener('canplaythrough', resolve, { once: true });
        testAudio.addEventListener('error', reject, { once: true });
        testAudio.load();
        
        // Timeout after 2 seconds
        setTimeout(() => reject(new Error('Timeout')), 2000);
      });
    } catch {
      console.info('Audio files not available, using Web Audio API fallbacks');
      this.useWebAudio = true;
    }
  }

  private preloadSounds() {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (this.useWebAudio) return; // No need to preload for Web Audio API

    Object.entries(SOUND_EFFECTS).forEach(([key, config]) => {
      if (config.preload) {
        const audio = new Audio();
        audio.src = config.src;
        audio.volume = config.volume * this.masterVolume;
        audio.preload = 'auto';
        
        // Handle loading errors gracefully
        audio.addEventListener('error', () => {
          console.warn(`Failed to preload sound: ${key}`);
        });
        
        this.audioCache.set(key, audio);
      }
    });
  }

  private setupPreferenceListener() {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Listen for storage changes to update sound preferences
    window.addEventListener('storage', (e) => {
      if (e.key === 'mint-user-profile') {
        this.updateSoundPreferences();
      }
    });
    
    // Initial preference check
    this.updateSoundPreferences();
  }

  private updateSoundPreferences() {
    // Only run on client side
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    
    try {
      const profileData = localStorage.getItem('mint-user-profile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        this.isEnabled = profile.preferences?.sounds !== false;
      }
    } catch (error) {
      console.warn('Failed to read sound preferences:', error);
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update volume for cached audio elements
    this.audioCache.forEach((audio, key) => {
      const config = SOUND_EFFECTS[key];
      if (config) {
        audio.volume = config.volume * this.masterVolume;
      }
    });
  }

  public async play(soundKey: string): Promise<void> {
    // Only run on client side
    if (typeof window === 'undefined') return;
    if (!this.isEnabled) return;

    try {
      if (this.useWebAudio) {
        return this.playFallbackSound(soundKey);
      } else {
        return this.playAudioFile(soundKey);
      }
    } catch (error) {
      console.warn(`Failed to play sound ${soundKey}:`, error);
      // Try fallback sound
      if (!this.useWebAudio) {
        return this.playFallbackSound(soundKey);
      }
    }
  }

  private async playAudioFile(soundKey: string): Promise<void> {
    const config = SOUND_EFFECTS[soundKey];
    if (!config) return;

    let audio = this.audioCache.get(soundKey);
    
    if (!audio) {
      audio = new Audio();
      audio.src = config.src;
      audio.volume = config.volume * this.masterVolume;
      
      if (!config.preload) {
        this.audioCache.set(soundKey, audio);
      }
    }

    // Reset audio to beginning if it's already playing
    audio.currentTime = 0;
    
    return audio.play();
  }

  private async playFallbackSound(soundKey: string): Promise<void> {
    const fallback = FALLBACK_SOUNDS[soundKey];
    if (!fallback) return;

    return generateTone(
      fallback.frequency, 
      fallback.duration, 
      fallback.volume * this.masterVolume
    );
  }

  // Convenience methods for specific sound types
  public playRewardSound(rewardType: RewardType): Promise<void> {
    const soundKey = `reward-${rewardType.toLowerCase()}`;
    return this.play(soundKey);
  }

  public playActionSound(actionType: ActionType, success: boolean = true): Promise<void> {
    let soundKey: string;
    
    switch (actionType) {
      case ActionType.CODE_SCAN:
        soundKey = success ? 'scan-success' : 'scan-error';
        break;
      case ActionType.VIDEO_WATCH:
        soundKey = 'video-complete';
        break;
      case ActionType.LOCATION_CHECKIN:
        soundKey = 'checkin-success';
        break;
      default:
        return Promise.resolve();
    }
    
    return this.play(soundKey);
  }

  public playUISound(type: 'click' | 'tab-switch' | 'achievement' | 'streak-bonus'): Promise<void> {
    const soundMap = {
      'click': 'button-click',
      'tab-switch': 'tab-switch',
      'achievement': 'achievement-unlock',
      'streak-bonus': 'streak-bonus'
    };
    
    return this.play(soundMap[type]);
  }

  // Method to test all sounds (useful for development)
  public async testAllSounds(): Promise<void> {
    console.log('Testing all sound effects...');
    
    for (const soundKey of Object.keys(SOUND_EFFECTS)) {
      console.log(`Playing: ${soundKey}`);
      await this.play(soundKey);
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay between sounds
    }
  }

  // Cleanup method
  public dispose() {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache.clear();
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Export convenience functions
export const playRewardSound = (rewardType: RewardType) => soundManager.playRewardSound(rewardType);
export const playActionSound = (actionType: ActionType, success: boolean = true) => soundManager.playActionSound(actionType, success);
export const playUISound = (type: 'click' | 'tab-switch' | 'achievement' | 'streak-bonus') => soundManager.playUISound(type);

// Hook for React components
export const useSounds = () => {
  return {
    playRewardSound,
    playActionSound,
    playUISound,
    testAllSounds: () => soundManager.testAllSounds(),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled),
    setVolume: (volume: number) => soundManager.setMasterVolume(volume)
  };
};