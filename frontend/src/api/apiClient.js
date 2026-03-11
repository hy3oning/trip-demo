import axios from 'axios';

const apiClient = axios.create({
  // 프론트는 baseURL 보다 `/api/v1/...` 경로 고정에 의존한다.
  // mock 단계에서는 Vite proxy -> json-server 로 가고,
  // 이후에는 같은 요청을 Spring Boot -> Oracle DB 로 넘기면 된다.
  // 즉 mock -> real backend 전환 시 이 파일보다 proxy/배포 env 변경이 우선 포인트다.
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('tripzone:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
