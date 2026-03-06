# UI 설계 — Airbnb 스타일 MVP

## 디자인 시스템

| 항목 | 값 |
|---|---|
| 주조색 | `#FF385C` (버튼/강조) |
| 텍스트 | `#222222` / 서브 `#717171` |
| 배경 | `#FFFFFF` / 섹션 `#F7F7F7` |
| 보더 | `#DDDDDD` / 라이트 `#EBEBEB` |
| 카드 그림자 | `0 2px 16px rgba(0,0,0,0.10)` |
| 최대 너비 | `1120px` |
| 이미지 비율 | 카드 `3:2`, 상세 `16:9` |
| 보더 라디우스 | 카드 `12px`, 버튼 `8px`, 검색바 `32px` (pill) |
| 헤더 높이 | `80px` |

## 토큰 파일
`src/styles/tokens.js`

## 공통 컴포넌트
- `SearchBar` — pill 검색바 (지역/체크인/체크아웃/인원)
- `LodgingCard` — 이미지+정보 카드 (hover scale)
- `GuestCounter` — +/- 인원 조절
- `BookingSummaryCard` — 예약 요금 요약 (sticky)
- `Badge` — 상태 배지

## 페이지별 설계

### 1. HomePage
- Hero: 흰 배경 + 대형 텍스트 + pill SearchBar
- 지역 빠른 선택 (아이콘 행)
- 추천 숙소 카드 그리드 (4열)

### 2. LodgingListPage
- Sticky compact SearchBar
- 필터 바 (정렬)
- 카드 그리드 3열

### 3. LodgingDetailPage
- 풀폭 이미지 갤러리
- 2컬럼 (좌: 정보/지도, 우: sticky 예약 카드)

### 4. BookingPage
- 2컬럼 (좌: 입력폼, 우: sticky 요금 요약)
- GuestCounter 인원 조절

### 5. BookingCompletePage
- 중앙 정렬 카드
- 예약 정보 요약 + 액션 버튼

### 6. MyPage
- 2컬럼 (좌: 프로필 사이드바+탭, 우: 컨텐츠)
- role별 탭 메뉴 분기

### 7. SellerLodgingCreatePage
- 단일 컬럼 폼, 섹션 구분
- 기본정보 / 상세설명 / 위치좌표

### 8. SellerLodgingListPage
- 가로형 카드 리스트 (썸네일+정보+액션)
- 빈 상태 CTA
