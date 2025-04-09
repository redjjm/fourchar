import { SoundType, SoundSettings } from '../types';

// 로컬 스토리지 키
const SOUND_SETTINGS_KEY = 'soundSettings';

// 사운드 경로 맵핑
const SOUND_PATHS: Record<SoundType, string> = {
  [SoundType.CORRECT]: '/src/sound/correct.mp3',
  [SoundType.WRONG]: '/src/sound/wrong.mp3',
  [SoundType.SCORE_20]: '/src/sound/score-20.mp3',
  [SoundType.SCORE_40]: '/src/sound/score-40.mp3',
  [SoundType.SCORE_80]: '/src/sound/score-80.mp3',
  [SoundType.SCORE_100]: '/src/sound/score-100.mp3',
  [SoundType.COLLECT_COIN]: '/src/sound/collect-coin.mp3',
  [SoundType.BG_1]: '/src/sound/bg-1.mp3',
};

// 사운드 캐싱
const soundCache: Record<string, HTMLAudioElement> = {};

// 배경음악 객체
let bgMusic: HTMLAudioElement | null = null;

// 기본 사운드 설정
const defaultSettings: SoundSettings = {
  bgSound: true,
  effectSound: true
};

// 사운드 설정 로드
export const loadSoundSettings = (): SoundSettings => {
  try {
    const savedSettings = localStorage.getItem(SOUND_SETTINGS_KEY);
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('사운드 설정 로드 오류:', error);
  }
  return defaultSettings;
};

// 사운드 설정 저장
export const saveSoundSettings = (settings: SoundSettings): void => {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('사운드 설정 저장 오류:', error);
  }
};

// 사운드 사전 로드
export const preloadSounds = (): void => {
  const settings = loadSoundSettings();
  
  Object.entries(SOUND_PATHS).forEach(([type, path]) => {
    try {
      if (type === SoundType.BG_1) {
        // 배경음악은 초기에는 로드만 하고 재생하지 않음
        // 재생은 playBackgroundMusic 함수에서 수행
        console.log('배경음악 초기 로드');
        // 캐시에만 저장
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.loop = true;
        audio.volume = 0.5;
        soundCache[type] = audio;
        
        // bgMusic은 따로 설정하지 않음
        // -> playBackgroundMusic에서 새로 생성하도록 함
      } else {
        // 일반 효과음
        const audio = new Audio(path);
        audio.preload = 'auto';
        soundCache[type] = audio;
      }
    } catch (error) {
      console.error(`사운드 로드 오류 (${type}):`, error);
    }
  });
};

// 사운드 재생
export const playSound = (type: SoundType, volume = 1.0): void => {
  const settings = loadSoundSettings();
  
  // 이펙트 사운드가 꺼져있으면 재생하지 않음 (배경음악 제외)
  if (!settings.effectSound && type !== SoundType.BG_1) {
    return;
  }
  
  try {
    // 캐시에 없으면 로드
    if (!soundCache[type]) {
      const audio = new Audio(SOUND_PATHS[type]);
      soundCache[type] = audio;
    }
    
    // 재생 중인 사운드 중지 후 처음부터 재생
    const sound = soundCache[type];
    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;
    
    // 사운드 재생
    sound.play().catch(error => {
      console.error('사운드 재생 오류:', error);
    });
  } catch (error) {
    console.error('사운드 재생 중 오류 발생:', error);
  }
};

// 점수에 따른 결과 사운드 재생
export const playScoreSound = (score: number): void => {
  if (score <= 20) {
    playSound(SoundType.SCORE_20);
  } else if (score <= 40) {
    playSound(SoundType.SCORE_40);
  } else if (score <= 80) {
    playSound(SoundType.SCORE_80);
  } else {
    playSound(SoundType.SCORE_100);
  }
};

// 배경음악 재생
export const playBackgroundMusic = (): void => {
  const settings = loadSoundSettings();
  
  // 배경음악 설정이 꺼져있으면 재생하지 않음
  if (!settings.bgSound) {
    return;
  }
  
  try {
    // 항상 새로운 오디오 객체 생성
    console.log('배경음악 객체 생성');
    bgMusic = new Audio(SOUND_PATHS[SoundType.BG_1]);
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    // 배경음악 끝날 때 다시 재생 (loop가 작동하지 않을 경우 대비)
    bgMusic.addEventListener('ended', () => {
      console.log('배경음악 재시작 (ended 이벤트)');
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(error => {
          console.error('배경음악 재시작 오류:', error);
        });
      }
    });
    
    // 오디오 컨텍스트 재개 시도 (Chrome 정책)
    if (typeof AudioContext !== 'undefined') {
      try {
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch (e) {
        console.error('오디오 컨텍스트 재개 오류:', e);
      }
    }
    
    console.log('배경음악 재생 시도');
    
    // 지연 후 재생 시도 (브라우저 정책 대응)
    setTimeout(() => {
      // Promise 기반 재생 시도
      const playPromise = bgMusic?.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('배경음악 재생 오류:', error);
          
          // 사용자 상호작용 없이 자동 재생 불가능 오류 (대부분의 브라우저)
          if (error.name === 'NotAllowedError') {
            console.log('자동 재생 정책으로 인해 나중에 재생됩니다.');
          } else {
            // 다른 오류는 BGM 객체 재생성 시도
            console.log('배경음악 객체 재생성 시도');
            setTimeout(() => {
              bgMusic = new Audio(SOUND_PATHS[SoundType.BG_1]);
              bgMusic.loop = true;
              bgMusic.volume = 0.5;
              
              // 지연 후 다시 재생 시도
              setTimeout(() => {
                bgMusic?.play().catch(e => console.error('재시도 실패:', e));
              }, 1000);
            }, 500);
          }
        });
      }
    }, 100);
  } catch (error) {
    console.error('배경음악 재생 중 오류 발생:', error);
  }
};

// 배경음악 중지
export const stopBackgroundMusic = (): void => {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
};

// 배경음악 토글
export const toggleBackgroundMusic = (): boolean => {
  const settings = loadSoundSettings();
  settings.bgSound = !settings.bgSound;
  
  if (settings.bgSound) {
    // 항상 새로운 오디오 객체 생성하여 문제 해결
    bgMusic = new Audio(SOUND_PATHS[SoundType.BG_1]);
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    
    // 배경음악 끝날 때 다시 재생 (loop가 작동하지 않을 경우 대비)
    bgMusic.addEventListener('ended', () => {
      console.log('배경음악 재시작');
      if (bgMusic) {
        bgMusic.currentTime = 0;
        bgMusic.play().catch(error => {
          console.error('배경음악 재시작 오류:', error);
        });
      }
    });
    
    // 오디오 컨텍스트 재개 시도 (Chrome 정책)
    if (typeof AudioContext !== 'undefined') {
      try {
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch (e) {
        console.error('오디오 컨텍스트 재개 오류:', e);
      }
    }
    
    // 명시적으로 재생 시도
    setTimeout(() => {
      if (bgMusic) {
        console.log('배경음악 재생 시도');
        bgMusic.play().catch(error => {
          console.error('배경음악 토글 재생 오류:', error);
          
          // 오류 발생 시 새 Audio 객체로 재시도
          bgMusic = new Audio(SOUND_PATHS[SoundType.BG_1]);
          bgMusic.loop = true;
          bgMusic.volume = 0.5;
          
          setTimeout(() => {
            bgMusic?.play().catch(err => {
              console.error('재시도 실패:', err);
            });
          }, 500);
        });
      }
    }, 100);
  } else {
    stopBackgroundMusic();
  }
  
  saveSoundSettings(settings);
  return settings.bgSound;
};

// 이펙트 사운드 토글
export const toggleEffectSound = (): boolean => {
  const settings = loadSoundSettings();
  settings.effectSound = !settings.effectSound;
  saveSoundSettings(settings);
  return settings.effectSound;
}; 