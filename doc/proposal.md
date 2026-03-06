# 제안서

## 요약
TravelZone MVP를 4개 Phase로 나누어 구축한다.
Phase 1(기획·구조) → Phase 2(React UI 데모) → Phase 3(Mock 연동) → Phase 4(백엔드 연결 준비) 순으로 진행하며, 각 Phase 완료 후 다음 작업을 시작한다.

---

## 문제
1. 현재 코드/구조가 전혀 없는 백지 상태이다.
2. 역할·도메인 용어 통일 기준은 PROJECT_BOOTSTRAP.md에 명시되어 있으나 아직 적용된 파일이 없다.
3. 팀 내 범위 확장 경향으로 인해 구현 우선순위와 완성 기준이 모호하다.

---

## 제안하는 변경

### Phase 1. 기획·구조 확립
- 프로젝트 루트 디렉토리 구조 생성 (`frontend/`, `backend/`, `docs/`)
- 프론트엔드 React 프로젝트 초기화 (Vite 기반)
- 폴더 구조 확립: `pages/`, `components/`, `api/`, `mock/`, `hooks/`, `store/`
- apiClient 파일 단일화 (`src/api/apiClient.js`) — baseURL 환경변수 기반
- 상수/타입 파일 정의 (`src/constants/roles.js`, `src/constants/inquiryTypes.js`)

#### 프론트엔드 디렉토리 구조
```
frontend/
  src/
    pages/
      common/          # HomePage, LoginPage, SignupPage, MyPage
      user/            # LodgingSearchPage, LodgingListPage, LodgingDetailPage
                       # BookingPage, BookingCompletePage, MyBookingsPage
                       # InquiryCreatePage, MyInquiriesPage
      seller/          # SellerDashboardPage, SellerLodgingCreatePage
                       # SellerLodgingEditPage, SellerLodgingListPage
                       # SellerReservationListPage, SellerInquiryPage
      admin/           # AdminDashboardPage, AdminUserListPage
                       # AdminSellerListPage, AdminInquiryListPage
    components/
      layout/          # Header, Footer, Sidebar, ProtectedRoute
      lodging/         # LodgingCard, LodgingSearchBar, LodgingMap
      booking/         # BookingForm, BookingSummary
      inquiry/         # InquiryForm, InquiryList
      common/          # Button, Input, Modal, Badge, Pagination
    api/
      apiClient.js     # axios 인스턴스, baseURL 환경변수
      auth.js
      lodging.js
      booking.js
      inquiry.js
      review.js
      seller.js
      admin.js
    mock/
      users.json
      lodgings.json
      bookings.json
      inquiries.json
    hooks/
      useAuth.js
      useLodgings.js
      useBooking.js
    store/
      authStore.js     # 로그인 상태, role 관리
    constants/
      roles.js         # ADMIN / SELLER / USER
      inquiryTypes.js  # USER_TO_SELLER / SELLER_TO_ADMIN / COMMON_TO_ADMIN
    router/
      AppRouter.jsx    # 권한별 라우팅, ProtectedRoute
```

#### 백엔드 디렉토리 구조 (Phase 4 준비)
```
backend/
  src/main/java/com/tripzone/
    controller/
    service/
    repository/
    domain/
    dto/
    config/
  src/main/resources/
    application.yml
```

---

### Phase 2. React UI 데모 (핵심 페이지)
구현 우선순위 순:

| 우선순위 | 페이지 | 권한 |
|---|---|---|
| 1 | HomePage | 공통 |
| 2 | LoginPage / SignupPage | 공통 |
| 3 | LodgingListPage / LodgingDetailPage | USER |
| 4 | BookingPage / BookingCompletePage | USER |
| 5 | MyPage / MyBookingsPage | USER |
| 6 | SellerDashboardPage / SellerLodgingCreatePage | SELLER |
| 7 | SellerLodgingListPage / SellerReservationListPage | SELLER |
| 8 | InquiryCreatePage / MyInquiriesPage | USER/SELLER |
| 9 | AdminDashboardPage / AdminInquiryListPage | ADMIN |

---

### Phase 3. Mock 연동
- json-server로 mock API 서버 구동
- 사용자 예약 흐름 end-to-end 연결
- 판매자 숙소 등록 → 목록 반영 흐름 연결
- 문의 생성 → 목록 조회 흐름 연결

---

### Phase 4. 백엔드 연결 준비
- Spring Boot 프로젝트 생성 (Maven)
- 엔티티 / DTO 정의
- REST API 구현 (PROJECT_BOOTSTRAP.md § 12 기준)
- 세션 기반 인증 구현
- Oracle 연결 설정

---

## 영향 파일
- `frontend/` (신규 생성 전체)
- `backend/` (Phase 4, 신규)
- `doc/brief.md` (완료)
- `doc/context.md` (갱신 예정)
- `doc/tasks.md` (approve 후 작성)

---

## 테스트 계획
- Phase 2: 각 페이지 브라우저 수동 확인, 권한별 라우팅 확인
- Phase 3: json-server 기동 후 예약 흐름 end-to-end 수동 확인
- Phase 4: 각 API 엔드포인트 Postman/curl 확인

---

## 승인 게이트
- 상태: `APPROVED`
- 승인자: 사용자
- 승인 시각: 2026-03-06
