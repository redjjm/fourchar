import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music3 } from 'lucide-react';
import {
  loadSoundSettings,
  toggleBackgroundMusic,
  toggleEffectSound
} from '../utils/sounds';

export function SoundControl() {
  const [bgSound, setBgSound] = useState(true);
  const [effectSound, setEffectSound] = useState(true);

  // 컴포넌트 마운트 시 저장된 설정 불러오기
  useEffect(() => {
    const settings = loadSoundSettings();
    setBgSound(settings.bgSound);
    setEffectSound(settings.effectSound);
  }, []);

  // 배경음악 토글
  const handleToggleBgSound = () => {
    const newState = toggleBackgroundMusic();
    setBgSound(newState);
  };

  // 이펙트 사운드 토글
  const handleToggleEffectSound = () => {
    const newState = toggleEffectSound();
    setEffectSound(newState);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <button
        onClick={handleToggleBgSound}
        className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors transform hover:scale-110"
        aria-label={bgSound ? '배경음악 끄기' : '배경음악 켜기'}
        title={bgSound ? '배경음악 끄기' : '배경음악 켜기'}
      >
        {bgSound ? (
          <Music className="w-6 h-6 text-kid-purple" />
        ) : (
          <Music3 className="w-6 h-6 text-kid-text/50" />
        )}
      </button>
      
      <button
        onClick={handleToggleEffectSound}
        className="p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors transform hover:scale-110"
        aria-label={effectSound ? '효과음 끄기' : '효과음 켜기'}
        title={effectSound ? '효과음 끄기' : '효과음 켜기'}
      >
        {effectSound ? (
          <Volume2 className="w-6 h-6 text-kid-teal" />
        ) : (
          <VolumeX className="w-6 h-6 text-kid-text/50" />
        )}
      </button>
    </div>
  );
} 