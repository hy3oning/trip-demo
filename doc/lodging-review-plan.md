# 숙소 상세 / 예약 / 리뷰 구현 계획

## 목적

- 숙소 상세 페이지를 "댓글" 수준이 아니라 실제 예약/리뷰 흐름이 보이는 화면으로 올린다.
- 프론트는 mock 기반으로 먼저 완성한다.
- 백엔드는 팀원이 최소 API만 붙여도 동작하도록 `TODO(back-end)` 기준을 명확히 남긴다.

## 현재 상태

- 숙소 상세: [frontend/src/pages/user/LodgingDetailPage.jsx](/Users/changwan2450/Antigravity%20WorkSpace/trip-demo/frontend/src/pages/user/LodgingDetailPage.jsx)
  - 숙소 정보, 예약 진입, 문의, 임시 댓글 입력만 있음
  - 리뷰 별점, 이미지, 작성 가능 조건, 정렬, 수정/삭제 없음
- 예약 페이지: [frontend/src/pages/user/BookingPage.jsx](/Users/changwan2450/Antigravity%20WorkSpace/trip-demo/frontend/src/pages/user/BookingPage.jsx)
  - 일정, 인원, 예약자 정보, 혜택 적용까지 있음
  - 숙소/후기/리뷰 연결은 없음
- 예약 완료: [frontend/src/pages/user/BookingCompletePage.jsx](/Users/changwan2450/Antigravity%20WorkSpace/trip-demo/frontend/src/pages/user/BookingCompletePage.jsx)
  - 결제/혜택 결과만 있음
  - 후기 작성 유도 없음
- 백엔드
  - `Lodging`/`Booking`은 있으나 `Review` 도메인/서비스/API는 아직 없음

## 목표 화면

### 1. 숙소 상세 페이지

- 상단 갤러리
- 숙소 요약
- 예약 카드
- 숙소 소개
- 편의/정책 요약
- 위치
- 리뷰 요약
  - 평균 별점
  - 리뷰 수
  - 사진 리뷰 수
- 리뷰 정렬 탭
  - 최신순
  - 평점 높은순
  - 사진 리뷰
- 리뷰 리스트
  - 작성자
  - 별점
  - 작성일
  - 내용
  - 이미지 최대 5장
  - 본인 리뷰면 수정/삭제 버튼
- 리뷰 작성 영역
  - 로그인 안 했으면 로그인 유도
  - 예약 완료 이력이 없으면 "투숙 완료 후 작성 가능" 안내
  - 작성 가능하면 별점/내용/이미지 업로드 폼 표시

### 2. 예약 완료 페이지

- 예약 완료 정보
- 사용 쿠폰/포인트/적립 예정
- 후기 작성 유도 CTA
  - `리뷰 작성하러 가기`

### 3. 마이페이지 또는 내 예약

- 완료된 예약에서만 `리뷰 작성` 또는 `리뷰 보기` 버튼 표시
- 나중에 확장 시 `내 리뷰` 탭으로 분리 가능

## 프론트 구현 기본안

### Phase 1. 리뷰 UI 교체

- `댓글` 섹션 제거
- `리뷰 섹션`으로 교체
- 새로 필요한 프론트 파일 기본안
  - `frontend/src/mock/reviewMockData.js`
  - `frontend/src/utils/reviewMock.js`
  - `frontend/src/components/review/RatingStars.jsx`
  - `frontend/src/components/review/ReviewCard.jsx`
  - `frontend/src/components/review/ReviewComposer.jsx`

### Phase 2. mock 동작

- `localStorage` 또는 mock util 기반으로 동작
- 지원 기능
  - 리뷰 목록 조회
  - 리뷰 등록
  - 리뷰 삭제
  - 사진 미리보기
  - 작성 가능 여부 계산

### Phase 3. 예약/리뷰 연결

- 예약 완료 페이지에 `리뷰 작성하러 가기` CTA 추가
- `내 예약`에서 완료 예약에 `리뷰 작성` 버튼 추가
- 이미 작성한 예약이면 `리뷰 보기` 또는 `리뷰 수정` 버튼 노출

## 프론트 mock 데이터 shape

```js
{
  reviewId: 101,
  lodgingId: 3,
  bookingId: 12,
  userId: 1,
  authorName: "여행자 민지",
  rating: 5,
  content: "위치가 좋아서 이동이 편했고 객실도 깔끔했습니다.",
  imageUrls: [
    "https://picsum.photos/seed/review-101-1/320/240",
    "https://picsum.photos/seed/review-101-2/320/240"
  ],
  createdAt: "2026-03-11T12:30:00",
  canEdit: true,
  canDelete: true
}
```

### 리뷰 작성 가능 여부 mock shape

```js
{
  canWrite: true,
  reason: "",
  bookingId: 12
}
```

### 사진 업로드 프론트 기본안

- 실제 업로드 전:
  - `input type="file" multiple accept="image/*"` 사용
  - `URL.createObjectURL(file)`로 미리보기
  - 최대 5장 제한
- 나중에 백엔드 연결 시:
  - `imageFiles` -> 업로드 API
  - 응답 `imageUrls` -> 리뷰 생성 API에 전달

## 백엔드 최소 API 기본안

### 1. 리뷰 목록 조회

`GET /api/v1/lodgings/{lodgingId}/reviews`

응답 기본안:

```json
{
  "summary": {
    "averageRating": 4.8,
    "reviewCount": 12,
    "photoReviewCount": 5
  },
  "items": [
    {
      "reviewId": 101,
      "lodgingId": 3,
      "bookingId": 12,
      "userId": 1,
      "authorName": "여행자 민지",
      "rating": 5,
      "content": "위치가 좋아서 이동이 편했고 객실도 깔끔했습니다.",
      "imageUrls": ["/uploads/reviews/101-1.jpg"],
      "createdAt": "2026-03-11T12:30:00",
      "canEdit": true,
      "canDelete": true
    }
  ]
}
```

### 2. 리뷰 작성 가능 여부 조회

`GET /api/v1/lodgings/{lodgingId}/review-eligibility?userId={userId}`

응답 기본안:

```json
{
  "canWrite": true,
  "reason": "",
  "bookingId": 12
}
```

`reason` 예시:

- `LOGIN_REQUIRED`
- `COMPLETED_BOOKING_REQUIRED`
- `ALREADY_REVIEWED`

### 3. 리뷰 작성

`POST /api/v1/lodgings/{lodgingId}/reviews`

요청 기본안:

```json
{
  "bookingId": 12,
  "userId": 1,
  "rating": 5,
  "content": "위치가 좋고 숙소가 깔끔했습니다.",
  "imageUrls": ["/uploads/reviews/temp-1.jpg"]
}
```

### 4. 리뷰 삭제

`DELETE /api/v1/reviews/{reviewId}`

### 5. 선택: 리뷰 수정

`PATCH /api/v1/reviews/{reviewId}`

## 백엔드 팀원 구현 규칙

- 리뷰는 `COMPLETED` 상태 예약 기준만 작성 가능
- 같은 `bookingId` 당 리뷰 1개
- 작성자 본인만 수정/삭제 가능
- 리뷰 저장/삭제 후 숙소 평점과 리뷰 수 갱신
- 이미지 최대 5장

## TODO(back-end) 주석 위치

### LodgingDetailPage

- 리뷰 목록 조회 API 교체
- 리뷰 요약(평점/리뷰 수/사진 리뷰 수) 연결
- 리뷰 작성 가능 여부 API 연결

### BookingCompletePage

- 완료 예약 기준 후기 작성 진입 경로 연결

### MyBookingsPage

- 완료 예약의 리뷰 작성 여부 표시
- `리뷰 작성` / `리뷰 보기` 버튼 노출

### 새 review util/component

- mock 저장 로직을 API 호출로 교체

## 구현 순서 권장안

1. `LodgingDetailPage`의 댓글 섹션을 리뷰 섹션으로 교체
2. 리뷰 카드/별점/작성 폼 컴포넌트 분리
3. mock 리뷰 목록/등록/삭제 구현
4. `BookingCompletePage`에 `리뷰 작성하러 가기` 버튼 추가
5. `MyBookingsPage`에 완료 예약 리뷰 액션 추가
6. 각 파일에 `TODO(back-end)` 주석 보강

## 지금 기준 결론

- 프론트는 먼저 충분히 만들 수 있다.
- 백엔드는 최소 4개 API만 있어도 프론트 연결 가능하다.
- 가장 안전한 진행 순서는 `숙소 상세 리뷰 UI -> 예약 완료 CTA -> 내 예약 리뷰 액션` 이다.
