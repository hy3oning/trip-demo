# 현재 컨텍스트

## Resume Pointer
- workflow_state: `IMPLEMENTED`
- last_command: `implement (Auth UI 소셜 버튼/아이콘 정합성 개선)`
- next_command_candidate: update-context
- resume_steps:
  1. review: Login/Signup 소셜 버튼 시각 정합성 점검
  2. qa: `/login`, `/signup` 모바일 뷰 레이아웃 확인
  3. update-context: 검증 결과 반영 후 next command 결정

## 현재 상태
- 데모 우선 전략으로 json-server 중심 진행
- Phase 1 항목 완료:
  - React/Vite 프로젝트 및 폴더 구조 유지 확인
  - `apiClient` 환경변수 기반 구성 확인 (`.env.development`)
  - `roles.js`, `inquiryTypes.js` 상수 파일 유지
  - `AppRouter`, `ProtectedRoute`, `authStore`, `Header/Footer` 동작 확인
  - 의존성에 `leaflet`, `react-leaflet` 추가
  - 프론트 proxy를 `http://localhost:3001`로 복원
  - 검증: `npm run build` 성공, `npm run dev` 기동 확인
- Phase 2 항목 완료:
  - 공통/사용자/판매자/관리자 페이지 라우팅 구성 완료
  - Lodging detail 지도 컴포넌트 추가: `src/components/lodging/LodgingMap.jsx` (Leaflet)
  - 지도 스타일/마커 로딩 설정: `src/main.jsx`
  - 판매자 회원가입 시 사업자등록번호/사업자등록증 파일 입력 UI 추가
  - Login/Signup 소셜 버튼 아이콘을 플랫폼 스타일에 가깝게 교체 (Kakao/Naver/Google/Apple)
  - Login/Signup 패널 레이아웃을 `auto-fit` 기반으로 조정해 좁은 화면 대응 개선
  - 예약/문의 조회 페이지를 API 모듈 기반 조회로 정리 (`MyBookingsPage`, `MyInquiriesPage`)
  - 검증: `npm run build` 성공 (`180 modules transformed`, `built in 918ms`)

## 백엔드 디렉토리
```
backend/tripzone-backend/
  pom.xml
  src/main/java/com/tripzone/...
  src/main/resources/application.yml
```

## 생성해야 할 패키지 구조
```
src/main/java/com/tripzone/
  TripzoneApplication.java
  config/
    SecurityConfig.java
    WebConfig.java (CORS)
  domain/
    User.java
    Lodging.java
    Booking.java
    Inquiry.java
  dto/
    auth/  LoginRequest.java, SignupRequest.java, UserResponse.java
    lodging/  LodgingRequest.java, LodgingResponse.java
    booking/  BookingRequest.java, BookingResponse.java
    inquiry/  InquiryRequest.java, InquiryResponse.java
  repository/
    UserRepository.java
    LodgingRepository.java
    BookingRepository.java
    InquiryRepository.java
  service/
    AuthService.java
    LodgingService.java
    BookingService.java
    InquiryService.java
  controller/
    AuthController.java
    LodgingController.java
    BookingController.java
    InquiryController.java
    SellerController.java
    AdminController.java
```

## API 엔드포인트 (PROJECT_BOOTSTRAP.md §12 기준)
- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET  /api/v1/auth/me
- GET  /api/v1/lodgings (query: region, sellerId)
- GET  /api/v1/lodgings/{lodgingId}
- POST /api/v1/lodgings
- PATCH /api/v1/lodgings/{lodgingId}
- DELETE /api/v1/lodgings/{lodgingId}
- POST /api/v1/bookings
- GET  /api/v1/bookings/me
- POST /api/v1/bookings/{bookingId}/cancel
- POST /api/v1/inquiries
- GET  /api/v1/inquiries/me
- GET  /api/v1/seller/lodgings
- GET  /api/v1/seller/bookings
- GET  /api/v1/admin/users
- GET  /api/v1/admin/inquiries

## DB 엔티티 (PROJECT_BOOTSTRAP.md §10 기준)
- User: userId, email, password, name, role(ENUM), phone, createdAt
- Lodging: lodgingId, sellerId, name, region, address, description, pricePerNight, thumbnailUrl, latitude, longitude, rating, createdAt
- Booking: bookingId, userId, lodgingId, checkIn, checkOut, guests, totalPrice, bookingStatus(ENUM), createdAt
- Inquiry: inquiryId, senderUserId, inquiryType(ENUM), title, content, inquiryStatus(ENUM), createdAt

## 기술 스택
- Spring Boot 3.2.5 / Java 17 / Maven
- Spring Security (세션 기반, HttpSession)
- Spring Data JPA + Oracle (ojdbc11)
- Lombok
- 포트: 8080
- CORS: localhost:5174 (Vite dev server) 허용

## 프론트 연동 정보
- Vite proxy: `/api` → `http://localhost:3001` (json-server)
- Phase 4 완료 후 proxy를 `http://localhost:8080`으로 변경하면 됨
- 또는 `.env.development`에 `VITE_API_BASE_URL=http://localhost:8080` 설정

## Java 환경 설정
```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```
(매 터미널 세션마다 설정 필요 — .zshrc에 추가 권장)

## 개발 서버 실행 (현재)
```bash
터미널 1: cd frontend && npm run mock   (json-server :3001)
터미널 2: cd frontend && npm run dev    (Vite :5174)
```

## 테스트 계정
user@test.com / seller@test.com / admin@test.com (비밀번호: 1234)
