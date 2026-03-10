import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['unwatery-khloe-euphoniously.ngrok-free.dev'],
    proxy: {
      // 현재는 json-server mock 으로 프록시한다.
      // 나중에 Spring Boot + Oracle DB 로 전환할 때도 프론트 API path 는 `/api/v1/...` 그대로 두고
      // 여기 target 만 백엔드 서버 주소로 바꾸는 방식이 가장 안전하다.
      // 예: '/api': 'http://localhost:8080'
      '/api': 'http://localhost:3001',
    },
  },
})
