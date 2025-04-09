import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadSounds, playBackgroundMusic } from './utils/sounds.ts'

// 사운드 미리 로드
preloadSounds();

// 배경음악 재생 - 지연 시작 및 사용자 상호작용 후 재시도
setTimeout(() => {
  playBackgroundMusic();

  // 사용자 상호작용(클릭, 터치 등) 감지 시 다시 재생 시도
  const handleUserInteraction = () => {
    console.log('사용자 상호작용 감지: 배경음악 재생 시도');
    playBackgroundMusic();
    
    // 이벤트 리스너는 한 번만 실행 후 제거
    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
    document.removeEventListener('keydown', handleUserInteraction);
  };
  
  // 사용자 상호작용 이벤트 리스너 등록
  document.addEventListener('click', handleUserInteraction);
  document.addEventListener('touchstart', handleUserInteraction);
  document.addEventListener('keydown', handleUserInteraction);
}, 1000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
