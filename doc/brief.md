# 요구사항 브리프

## 한 줄 설명
국내 숙소 예약 웹 플랫폼 MVP — 숙박업체 등록 / 숙소 검색 / 숙소 예약의 3가지 핵심 흐름을 구현한다.

## 핵심 문제
- 팀 내 아이디어가 과도하게 확장되어 완성 가능성이 낮아지고 있다.
- 역할(관리자/판매자/사용자) 및 도메인 용어(lodging, seller, user)가 통일되지 않으면 백엔드 연결 시 혼란이 발생한다.
- UI 데모 없이 백엔드를 먼저 구성하면 팀 협업 및 시연이 어렵다.

## 목표
- React 기반 UI 데모를 먼저 구축해 완성 가능한 결과물을 확보한다.
- ADMIN / SELLER / USER 3가지 권한 기반 페이지 흐름을 확립한다.
- 이후 Spring Boot + Oracle 백엔드로 교체 가능하도록 apiClient를 단일화한다.
- 용어, 변수명, API 경로를 PROJECT_BOOTSTRAP.md 기준으로 고정한다.

## 제외 범위
- 항공권, 렌터카, 여행 종합 플랫폼화
- 날씨, 지도 고도화(길찾기, 주변 추천)
- 추천 알고리즘
- 실시간 외부 API 연동
- 복잡한 결제 / 채팅 / 푸시 시스템

## 핵심 엔티티
- User (ADMIN / SELLER / USER)
- SellerProfile
- Lodging
- Booking
- Inquiry (3종: 사용자→판매자 / 판매자→관리자 / 사용자·판매자→관리자)
- Review

## 기술 스택
- Frontend: React (mock 데이터 → json-server → 실제 API 순 교체)
- Backend: Java / Spring Boot / Maven / 세션 기반 인증
- DB: Oracle (Long ID 기준, snake_case 컬럼)
