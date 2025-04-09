import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadSounds, playBackgroundMusic } from './utils/sounds.ts'

// 앱 시작 시 로그 출력
console.log('앱 시작: 사운드 초기화 중...');

// 사운드 미리 로드 (오류 처리 추가)
try {
  preloadSounds();
  console.log('사운드 사전 로드 완료');
} catch (error) {
  console.error('사운드 사전 로드 중 오류 발생:', error);
}

// DOM 로드 완료 후 사운드 재생 시도 (보다 안정적)
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료: 배경음악 재생 준비');
  
  // 배경음악 재생 - 지연 시작
  setTimeout(() => {
    try {
      console.log('배경음악 초기 재생 시도');
      playBackgroundMusic();
    } catch (error) {
      console.error('배경음악 초기 재생 실패:', error);
    }

    // 사용자 상호작용(클릭, 터치 등) 감지 시 다시 재생 시도
    const handleUserInteraction = () => {
      console.log('사용자 상호작용 감지: 배경음악 재생 재시도');
      try {
        playBackgroundMusic();
      } catch (error) {
        console.error('사용자 상호작용 후 배경음악 재생 실패:', error);
      }
      
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
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
