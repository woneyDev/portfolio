import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // VITE_BASE_PATH 환경변수가 있으면 사용하고, 없으면 '/' 사용
    // GitHub Pages 배포: VITE_BASE_PATH=/portfolio/
    // Docker 로컬 실행: 환경변수 없음 → '/' 자동 사용
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    // react-grid-layout(및 내부 prop-types)가 참조하는 process.env.NODE_ENV를 개발 서버에서도 치환해준다.
    // (프로덕션 빌드에서는 Vite가 자동으로 치환하지만, dev 서버는 그렇지 않아 "process is not defined" 콘솔 에러가 남는다.)
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
