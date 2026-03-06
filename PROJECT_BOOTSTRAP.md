# TravelZone / 국내 숙소 예약 플랫폼 MVP
## 프로젝트 부트스트랩 문서 (Claude 첫 입력용)

---

## 0. 작업 목적

이 프로젝트는 **국내 숙소 예약 웹 플랫폼 MVP**를 만드는 팀 프로젝트다.

현재 팀 내에서 아이디어가 과하게 확장되는 경향이 있다.  
따라서 이 문서는 **"지금 당장 구현 가능한 범위"를 강하게 고정**하고,  
프론트 데모 → 백엔드 연결 → 점진적 확장 순서로 개발하기 위한 기준 문서다.

이 문서를 기준으로 다음을 수행하라:

1. 프로젝트 범위를 과도하게 넓히지 말 것
2. MVP 기준 핵심 기능만 우선 설계할 것
3. UI 데모를 먼저 만들고 이후 Spring Boot + Oracle 구조로 연결 가능하게 설계할 것
4. 폴더 구조, 역할 구조, API 초안, 데이터 모델, 화면 흐름을 일관되게 제안할 것
5. 구현 전 반드시 계획부터 정리할 것

---

## 1. 절대 우선 원칙

### 1-1. 범위 통제
다음 기능은 **이번 MVP 범위에서 제외**한다.

- 항공권 예약
- 렌터카
- 여행 종합 플랫폼화
- 날씨
- 지도 기반 복잡한 길찾기
- 추천 알고리즘
- 실시간 외부 API 연동
- 복잡한 결제 시스템
- 복잡한 채팅 시스템
- 앱 수준의 푸시 기능

### 1-2. 이번 MVP 핵심
이번 프로젝트는 아래 3가지만 중심으로 한다.

- 숙박업체 등록
- 숙소 검색
- 숙소 예약

### 1-3. 개발 현실성 우선
이 프로젝트는 팀 프로젝트이며,  
현재 수준에서 **완성 가능한 결과물**이 가장 중요하다.

따라서 기능 수보다 아래를 더 우선한다.

- 페이지 흐름이 자연스러운가
- 데모가 실제 서비스처럼 보이는가
- 백엔드 연결이 쉬운 구조인가
- 역할/권한이 명확한가
- 변수명/API/데이터 구조가 일관적인가

---

## 2. 서비스 정의

### 서비스 한 줄 설명
국내 숙박업체가 숙소를 등록하고,  
사용자가 숙소를 검색하고 예약할 수 있는 웹 플랫폼

### 서비스 포지션
- 여기어때/야놀자 같은 국내 숙소 예약 서비스의 축소형 MVP
- 웹 기반 예약 플랫폼
- 관리자 / 판매자 / 사용자 구조 포함
- 단, 모든 기능을 다 따라하지 않고 핵심 예약 흐름만 구현

---

## 3. 역할 구조

이번 프로젝트는 반드시 **권한 3개**로 설계한다.

### 3-1. 관리자 (ADMIN)
역할:
- 전체 사용자 관리
- 전체 판매자 관리
- 문의사항 확인 및 처리
- 시스템 장애 / 공지성 문의 관리
- 숙소 등록 승인/검토 여부는 선택 기능으로 설계 가능

### 3-2. 판매자 (SELLER)
역할:
- 사업자 등록 기반 판매자 개념
- 숙소 등록 / 수정 / 삭제
- 자기 숙소 예약 현황 조회
- 관리자에게 문의 가능
- 사용자에게 받은 문의 확인 가능

### 3-3. 사용자 (USER)
역할:
- 숙소 검색
- 숙소 상세 조회
- 예약 생성
- 내 예약 조회
- 판매자에게 숙소 관련 문의 가능
- 관리자에게 시스템 관련 문의 가능

---

## 4. 문의 기능 정책

문의사항은 팀에서 중요하게 말이 나온 기능이므로 구조를 먼저 분리한다.

### 4-1. 문의 유형 분리
문의는 한 종류로 뭉개지 말고 최소 3종류로 구분한다.

#### A. 사용자 → 판매자 문의
예:
- 숙소 관련 문의
- 체크인 가능 시간 문의
- 주차 가능 여부 문의
- 객실 옵션 문의

#### B. 판매자 → 관리자 문의
예:
- 사업자 승인 관련
- 숙소 등록 문제
- 관리자 요청 사항
- 운영 문의

#### C. 사용자 / 판매자 → 관리자 문의
예:
- 시스템 장애
- 로그인 문제
- 웹 오류
- 공통 시스템 문의

### 4-2. UI 정책
- 마이페이지에 내 문의 내역 조회는 가능
- 그러나 **시스템 장애 문의**는 단순 마이페이지만이 아니라
  별도 "문의하기" 진입점 또는 공통 고객센터형 진입점이 있어야 한다
- 문의 생성 화면은 문의 대상과 문의 유형이 명확해야 한다

---

## 5. 지도 기능 정책

지도는 풀스펙 지도 서비스가 아니라 **최소 기능만** 넣는다.

### 이번 MVP에서 지도 기능 정의
- 숙소 상세 페이지에서 숙소 위치 표시
- 위치 좌표(lat, lng) 기반 표시 가능 구조
- 정확한 길찾기, 주변 장소 추천, 실시간 지도 탐색은 제외

### 구현 원칙
- 지도는 "숙소 위치 보여주기" 수준으로 제한
- 데이터 모델에 위도/경도 필드 포함
- 복잡한 지도 기능은 확장 포인트로만 남김

---

## 6. 벤치마킹 방향

### 참고 방향
- 위홈 같은 국내 숙소 예약 서비스의 단순한 흐름 참고 가능
- 여기어때/야놀자의 핵심 UX 흐름 참고 가능
- 단, 외부 서비스의 모든 기능을 흉내내지 말 것

### 벤치마킹 핵심
아래만 참고:
- 홈 검색 구조
- 숙소 카드 리스트
- 숙소 상세 흐름
- 문의 진입 UX
- 예약 흐름

---

## 7. MVP 핵심 기능 목록

### 7-1. 공통
- 회원가입
- 로그인
- 권한별 분기
- 마이페이지

### 7-2. 사용자 기능
- 숙소 검색
- 숙소 목록 조회
- 숙소 상세 조회
- 예약 생성
- 내 예약 목록 조회
- 판매자 문의
- 관리자 문의

### 7-3. 판매자 기능
- 숙소 등록
- 숙소 수정
- 숙소 삭제
- 내 숙소 목록 조회
- 예약 현황 조회
- 관리자 문의
- 사용자 문의 조회

### 7-4. 관리자 기능
- 사용자 목록 조회
- 판매자 목록 조회
- 문의 관리
- 공통 시스템 문의 확인

---

## 8. 이번 데모에서 반드시 보여줘야 하는 흐름

데모는 아래 흐름이 이어져야 한다.

### 사용자 데모 흐름
1. 홈 진입
2. 지역 / 날짜 / 인원 기반 숙소 검색
3. 숙소 목록 확인
4. 숙소 상세 진입
5. 지도/위치 확인
6. 예약 진행
7. 예약 완료
8. 마이페이지에서 예약 내역 확인
9. 문의하기 진입

### 판매자 데모 흐름
1. 판매자 로그인
2. 숙소 등록 화면 진입
3. 숙소 등록
4. 내 숙소 목록 확인
5. 예약 현황 확인
6. 관리자 문의 진입

### 관리자 데모 흐름
1. 관리자 로그인
2. 문의 관리 화면 진입
3. 사용자/판매자 문의 목록 확인

---

## 9. 페이지 구조 제안

아래 페이지들을 기준으로 화면 구조를 설계하라.

### 공통
- HomePage
- LoginPage
- SignupPage
- MyPage

### 사용자
- LodgingSearchPage
- LodgingListPage
- LodgingDetailPage
- BookingPage
- BookingCompletePage
- MyBookingsPage
- InquiryCreatePage
- MyInquiriesPage

### 판매자
- SellerDashboardPage
- SellerLodgingCreatePage
- SellerLodgingEditPage
- SellerLodgingListPage
- SellerReservationListPage
- SellerInquiryPage

### 관리자
- AdminDashboardPage
- AdminUserListPage
- AdminSellerListPage
- AdminInquiryListPage

---

## 10. 데이터 모델 초안

아래 엔티티를 기준으로 설계하라.

### User
- userId
- email
- password
- name
- role
- phone
- createdAt
- updatedAt

### SellerProfile
- sellerId
- userId
- businessNumber
- businessName
- approvalStatus
- createdAt
- updatedAt

### Lodging
- lodgingId
- sellerId
- name
- region
- address
- description
- pricePerNight
- thumbnailUrl
- latitude
- longitude
- rating
- createdAt
- updatedAt

### Booking
- bookingId
- userId
- lodgingId
- checkIn
- checkOut
- guests
- totalPrice
- bookingStatus
- createdAt
- updatedAt

### Inquiry
- inquiryId
- senderUserId
- receiverType
- receiverId
- inquiryType
- title
- content
- inquiryStatus
- createdAt
- updatedAt

### Review
- reviewId
- userId
- lodgingId
- rating
- comment
- createdAt
- updatedAt

---

## 11. 변수명 / 네이밍 규칙

### 프론트 / API JSON / 자바 변수
- camelCase 사용

예:
- userId
- sellerId
- lodgingId
- bookingId
- inquiryId
- pricePerNight
- totalPrice
- createdAt

### DB 컬럼
- snake_case 사용

예:
- user_id
- seller_id
- lodging_id
- booking_id
- inquiry_id
- created_at
- updated_at

### 리소스 명명 규칙
숙소는 무조건 `lodging` 으로 통일한다.  
다음 명칭 혼용 금지:
- hotel
- room
- place
- accommodation

판매자는 `seller` 로 통일한다.  
관리자는 `admin`, 사용자는 `user`.

---

## 12. API 초안

### Auth
- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- GET /api/v1/auth/me

### Lodging
- GET /api/v1/lodgings
- GET /api/v1/lodgings/{lodgingId}
- POST /api/v1/lodgings
- PATCH /api/v1/lodgings/{lodgingId}
- DELETE /api/v1/lodgings/{lodgingId}

### Booking
- POST /api/v1/bookings
- GET /api/v1/bookings/me
- POST /api/v1/bookings/{bookingId}/cancel

### Seller
- GET /api/v1/seller/lodgings
- GET /api/v1/seller/bookings

### Admin
- GET /api/v1/admin/users
- GET /api/v1/admin/sellers
- GET /api/v1/admin/inquiries

### Inquiry
- POST /api/v1/inquiries
- GET /api/v1/inquiries/me
- GET /api/v1/inquiries/{inquiryId}

### Review
- GET /api/v1/lodgings/{lodgingId}/reviews
- POST /api/v1/lodgings/{lodgingId}/reviews

---

## 13. 기술 방향

### 프론트엔드
- React
- 페이지/컴포넌트 분리
- UI 데모 먼저 구축
- mock 데이터 / json-server 사용 가능
- 이후 실제 Spring Boot API로 교체 가능하도록 apiClient 단일화

### 백엔드
- Java
- Spring Boot
- Maven
- REST API
- 권한 3개 기반 설계
- 세션 기반 인증 우선 고려

### 데이터베이스
- 최종적으로 Oracle 연결 예정
- 따라서 DB 독립적 구조로 설계
- ID는 Long 기준으로 설계
- DB 종속 함수 남용 금지

---

## 14. 구현 순서 강제 규칙

반드시 아래 순서로 작업하라.

### Phase 1. 기획/구조
- 화면 흐름 정리
- 페이지 목록 정리
- 데이터 모델 초안 정리
- API 초안 정리
- 폴더 구조 제안

### Phase 2. UI 데모
- 홈
- 검색 결과
- 숙소 상세
- 예약
- 예약 완료
- 사용자 마이페이지
- 판매자 숙소 등록
- 관리자 문의 목록

### Phase 3. Mock 연동
- json-server 또는 mock data 연결
- 더미 예약 흐름 연결
- 문의 생성 흐름 연결

### Phase 4. 백엔드 연결 준비
- 실제 API 스펙 확정
- DTO 구조 정리
- 인증 방식 정리
- Oracle 전환 고려 구조 정리

---

## 15. 절대 금지 사항

- 구현 전 계획 없이 바로 코드 작성 시작
- 범위 확장 제안부터 시작
- 항공권/렌터카/날씨/지도 고도화 추가
- 복잡한 외부 API부터 붙이기
- 화면보다 백엔드 복잡도 먼저 높이기
- 용어 혼용
- 과도한 추상화
- 확인되지 않은 기능 완료 선언

---

## 16. 지금 당장 Claude에게 원하는 출력물

이 문서를 바탕으로 아래 순서대로 산출하라.

### 1단계
프로젝트를 다시 요약하고  
MVP 범위를 짧고 명확하게 재정리

### 2단계
페이지 구조 / 사용자 플로우 / 권한별 플로우 정리

### 3단계
프로젝트 루트 구조 제안
- frontend
- backend
- docs
기준으로

### 4단계
프론트엔드 컴포넌트 구조 제안
React 기준

### 5단계
API 명세 초안 정리

### 6단계
DB 엔티티 관계 정리

### 7단계
작업 우선순위(Task breakdown) 제안

중요:
- 아직 바로 구현하지 말 것
- 먼저 설계와 계획을 명확히 정리할 것
- 출력은 팀 프로젝트 문서처럼 깔끔하고 구조적으로 작성할 것

---