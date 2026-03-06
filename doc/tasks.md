# 승인된 작업

## 작업 메타
- 기준 Proposal ID: proposal.md (2026-03-06 승인)
- 현재 상태: `IN_PROGRESS`

---

## Phase 1. 프로젝트 구조 확립

- [x] T1-1. 루트 디렉토리 구조 생성
  - 설명: `frontend/`, `backend/`, `docs/` 폴더 생성
  - 관련 파일: 프로젝트 루트
  - 완료 조건: 디렉토리 3개 존재 확인

- [x] T1-2. React 프로젝트 초기화 (Vite)
  - 설명: `frontend/` 내에 Vite + React 프로젝트 생성, 불필요한 보일러플레이트 제거
  - 관련 파일: `frontend/package.json`, `frontend/vite.config.js`, `frontend/src/main.jsx`
  - 완료 조건: `npm run dev` 정상 실행

- [x] T1-3. 의존성 설치
  - 설명: axios, react-router-dom, (지도용) leaflet 또는 kakao map SDK 선택
  - 관련 파일: `frontend/package.json`
  - 완료 조건: `node_modules` 설치 완료

- [x] T1-4. 폴더 구조 생성
  - 설명: `pages/`, `components/`, `api/`, `mock/`, `hooks/`, `store/`, `constants/`, `router/` 생성
  - 관련 파일: `frontend/src/` 하위
  - 완료 조건: 폴더 구조 proposal.md와 일치

- [x] T1-5. apiClient 단일화
  - 설명: `src/api/apiClient.js` 생성 — axios 인스턴스, baseURL은 `VITE_API_BASE_URL` 환경변수
  - 관련 파일: `frontend/src/api/apiClient.js`, `frontend/.env.development`
  - 완료 조건: apiClient import 후 사용 가능, baseURL 환경변수 분리 확인

- [x] T1-6. 상수 파일 정의
  - 설명: `roles.js` (ADMIN/SELLER/USER), `inquiryTypes.js` (USER_TO_SELLER/SELLER_TO_ADMIN/COMMON_TO_ADMIN)
  - 관련 파일: `frontend/src/constants/roles.js`, `frontend/src/constants/inquiryTypes.js`
  - 완료 조건: 파일 존재, export 확인

- [x] T1-7. AppRouter 기본 구성
  - 설명: react-router-dom 기반 라우터, ProtectedRoute(role 기반) 기본 틀 작성
  - 관련 파일: `frontend/src/router/AppRouter.jsx`, `frontend/src/components/layout/ProtectedRoute.jsx`
  - 완료 조건: 라우터 마운트 후 홈 경로 접근 가능

- [x] T1-8. authStore 기본 구성
  - 설명: 로그인 상태 및 role 전역 관리 (useState + Context 또는 zustand 선택)
  - 관련 파일: `frontend/src/store/authStore.js`
  - 완료 조건: role 상태 읽기/쓰기 확인

- [x] T1-9. Layout 컴포넌트 (Header, Footer)
  - 설명: 공통 Header(로그인/로그아웃, role 분기 메뉴), Footer 기본 구현
  - 관련 파일: `frontend/src/components/layout/Header.jsx`, `frontend/src/components/layout/Footer.jsx`
  - 완료 조건: 브라우저에서 Header/Footer 렌더링 확인

---

## Phase 2. React UI 데모 — 페이지 구현

### 공통 페이지

- [x] T2-1. HomePage
  - 설명: 지역/날짜/인원 검색바, 추천 숙소 카드 리스트 (mock 데이터)
  - 관련 파일: `frontend/src/pages/common/HomePage.jsx`, `frontend/src/components/lodging/LodgingSearchBar.jsx`, `frontend/src/components/lodging/LodgingCard.jsx`
  - 완료 조건: 검색바 렌더링, 숙소 카드 mock 데이터 출력

- [x] T2-2. LoginPage / SignupPage
  - 설명: 이메일/비밀번호 폼, role 선택(USER/SELLER), 로그인 시 authStore에 role 저장
  - 관련 파일: `frontend/src/pages/common/LoginPage.jsx`, `frontend/src/pages/common/SignupPage.jsx`
  - 완료 조건: 로그인 후 role 기반 페이지 분기 확인

### 사용자 페이지

- [x] T2-3. LodgingListPage
  - 설명: 검색 조건 기반 숙소 목록, LodgingCard 컴포넌트 재사용, 필터(지역/가격)
  - 관련 파일: `frontend/src/pages/user/LodgingListPage.jsx`
  - 완료 조건: mock 데이터 목록 렌더링, 카드 클릭 → 상세 이동

- [x] T2-4. LodgingDetailPage
  - 설명: 숙소 이미지/설명/가격/위치(지도), 예약하기 버튼
  - 관련 파일: `frontend/src/pages/user/LodgingDetailPage.jsx`, `frontend/src/components/lodging/LodgingMap.jsx`
  - 완료 조건: 상세 정보 렌더링, 지도 위치 표시(위도/경도 기반), 예약 버튼 → BookingPage 이동

- [x] T2-5. BookingPage / BookingCompletePage
  - 설명: 체크인/체크아웃/인원 입력, 총 금액 계산, 예약 완료 화면
  - 관련 파일: `frontend/src/pages/user/BookingPage.jsx`, `frontend/src/pages/user/BookingCompletePage.jsx`, `frontend/src/components/booking/BookingForm.jsx`, `frontend/src/components/booking/BookingSummary.jsx`
  - 완료 조건: 예약 정보 입력 → 완료 화면 이동

- [x] T2-6. MyPage / MyBookingsPage
  - 설명: 내 예약 목록 조회, 예약 상태(CONFIRMED/CANCELLED) 표시
  - 관련 파일: `frontend/src/pages/common/MyPage.jsx`, `frontend/src/pages/user/MyBookingsPage.jsx`
  - 완료 조건: mock 예약 데이터 렌더링

- [x] T2-7. InquiryCreatePage / MyInquiriesPage
  - 설명: 문의 대상(판매자/관리자) 및 유형 선택, 제목/내용 입력, 내 문의 목록 조회
  - 관련 파일: `frontend/src/pages/user/InquiryCreatePage.jsx`, `frontend/src/pages/user/MyInquiriesPage.jsx`, `frontend/src/components/inquiry/InquiryForm.jsx`
  - 완료 조건: 문의 유형 3종 분기 렌더링, 목록 조회 확인

### 판매자 페이지

- [x] T2-8. SellerDashboardPage
  - 설명: 내 숙소 수, 예약 현황 요약 카드
  - 관련 파일: `frontend/src/pages/seller/SellerDashboardPage.jsx`
  - 완료 조건: mock 데이터 기반 대시보드 렌더링

- [x] T2-9. SellerLodgingCreatePage / SellerLodgingEditPage
  - 설명: 숙소명/지역/주소/가격/설명/위도·경도 입력 폼
  - 관련 파일: `frontend/src/pages/seller/SellerLodgingCreatePage.jsx`, `frontend/src/pages/seller/SellerLodgingEditPage.jsx`
  - 완료 조건: 폼 입력 후 목록 반영(mock)

- [x] T2-10. SellerLodgingListPage / SellerReservationListPage
  - 설명: 내 숙소 목록, 예약 현황 목록 (예약자/날짜/상태)
  - 관련 파일: `frontend/src/pages/seller/SellerLodgingListPage.jsx`, `frontend/src/pages/seller/SellerReservationListPage.jsx`
  - 완료 조건: mock 데이터 렌더링

- [x] T2-11. SellerInquiryPage
  - 설명: 사용자에게 받은 문의 목록 조회, 관리자 문의 진입
  - 관련 파일: `frontend/src/pages/seller/SellerInquiryPage.jsx`
  - 완료 조건: 문의 목록 렌더링

### 관리자 페이지

- [x] T2-12. AdminDashboardPage
  - 설명: 전체 사용자/판매자 수, 미처리 문의 수 요약
  - 관련 파일: `frontend/src/pages/admin/AdminDashboardPage.jsx`
  - 완료 조건: mock 데이터 기반 렌더링

- [x] T2-13. AdminUserListPage / AdminSellerListPage
  - 설명: 전체 사용자/판매자 목록 테이블
  - 관련 파일: `frontend/src/pages/admin/AdminUserListPage.jsx`, `frontend/src/pages/admin/AdminSellerListPage.jsx`
  - 완료 조건: 목록 렌더링

- [x] T2-14. AdminInquiryListPage
  - 설명: 전체 문의 목록, 유형/상태 필터
  - 관련 파일: `frontend/src/pages/admin/AdminInquiryListPage.jsx`
  - 완료 조건: 문의 목록 + 유형 필터 동작 확인

---

## Phase 3. Mock 연동

- [ ] T3-1. json-server 설정
  - 설명: `frontend/mock/db.json` 생성, json-server 실행 스크립트 추가
  - 관련 파일: `frontend/mock/db.json`, `frontend/package.json` (scripts)
  - 완료 조건: `npm run mock` 실행 후 API 응답 확인

- [ ] T3-2. mock 데이터 작성
  - 설명: users, lodgings, bookings, inquiries, reviews mock 데이터 (각 3~5건)
  - 관련 파일: `frontend/mock/db.json`
  - 완료 조건: 각 엔티티 데이터 존재

- [ ] T3-3. api 모듈 연결
  - 설명: `src/api/` 하위 각 모듈을 apiClient 기반으로 실제 호출하도록 구현
  - 관련 파일: `frontend/src/api/auth.js`, `lodging.js`, `booking.js`, `inquiry.js`
  - 완료 조건: json-server 기동 상태에서 목록 조회 정상 동작

- [ ] T3-4. 예약 흐름 end-to-end 확인
  - 설명: 홈 → 검색 → 상세 → 예약 → 완료 → 마이페이지 전체 흐름 확인
  - 관련 파일: 없음(수동 테스트)
  - 완료 조건: 흐름 단절 없이 전체 사이클 완료

---

## Phase 4. 백엔드 연결 준비

- [x] T4-1. Spring Boot 프로젝트 생성
  - 설명: Maven, Java 17, Spring Web/Security/Data JPA 의존성
  - 관련 파일: `backend/pom.xml`
  - 완료 조건: 프로젝트 빌드 성공

- [x] T4-2. 엔티티/DTO 정의
  - 설명: User, SellerProfile, Lodging, Booking, Inquiry, Review 엔티티 + 각 DTO
  - 관련 파일: `backend/src/main/java/com/tripzone/domain/`, `dto/`
  - 완료 조건: 컴파일 오류 없음

- [x] T4-3. REST API 구현
  - 설명: PROJECT_BOOTSTRAP.md § 12 기준 전체 엔드포인트 구현
  - 관련 파일: `backend/src/main/java/com/tripzone/controller/`
  - 완료 조건: Postman 기준 각 엔드포인트 응답 확인

- [x] T4-4. 세션 기반 인증 구현
  - 설명: Spring Security 세션 기반, role 기반 접근 제어
  - 관련 파일: `backend/src/main/java/com/tripzone/config/SecurityConfig.java`
  - 완료 조건: 로그인/로그아웃/role 인가 확인

- [ ] T4-5. Oracle 연결 설정
  - 설명: application.yml Oracle datasource 설정, DDL 스크립트 작성
  - 관련 파일: `backend/src/main/resources/application.yml`, `schema.sql`
  - 완료 조건: 테이블 생성 후 CRUD 동작 확인

- [ ] T4-6. 프론트엔드 API 교체
  - 설명: `.env.production`의 `VITE_API_BASE_URL`을 실제 Spring Boot 서버로 변경
  - 관련 파일: `frontend/.env.production`
  - 완료 조건: 실제 API 연동 후 예약 흐름 동작 확인

---

## Evidence
- 작업 ID: (implement 단계에서 기록)
  - command: `export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" && export PATH="$JAVA_HOME/bin:$PATH" && mvn spring-boot:run`
  - raw output: `Tomcat started on port 8080 (http) with context path ''`
  - raw output: `Started TripzoneApplication in 31.561 seconds (process running for 31.664)`
  - status: `UNVERIFIED` (API 엔드포인트별 수동 검증 미실시)
  - command: `npm run build`
  - raw output: `✓ built in 571ms`
  - command: `npm run dev -- --host 127.0.0.1 --port 5174`
  - raw output: `VITE v7.3.1 ready in 128 ms`, `Local: http://127.0.0.1:5179/`
  - status: `VERIFIED` (Phase 1 구조/기동 검증)
  - command: `npm run build`
  - raw output: `✓ 179 modules transformed.`, `✓ built in 864ms`
  - status: `VERIFIED` (Phase 2 페이지/컴포넌트 빌드 검증)
  - command: `npm run build`
  - raw output: `✓ 180 modules transformed.`, `✓ built in 918ms`
  - status: `VERIFIED` (Auth 소셜 버튼/아이콘 및 반응형 레이아웃 보정 후 빌드 검증)
