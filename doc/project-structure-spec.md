# TripZone 프로젝트 구조 명세서

현재 저장소에 실제로 존재하는 파일과 패키지 기준으로 정리한 구조 명세서입니다.  
추가 예정 구조는 넣지 않았고, 현재 구현 기준만 반영했습니다.

## 1. 백엔드 구조 명세

| 구분 | 패키지명 | 파일명 |
| :-- | :-- | :-- |
| application | `com.tripzone` | `TripzoneApplication` |
| config | `com.tripzone.config` | `SecurityConfig` |
| config | `com.tripzone.config` | `SessionAuthenticationFilter` |
| config | `com.tripzone.config` | `SessionKeys` |
| config | `com.tripzone.config` | `WebConfig` |
| controller | `com.tripzone.controller` | `AdminController` |
| controller | `com.tripzone.controller` | `AuthController` |
| controller | `com.tripzone.controller` | `BookingController` |
| controller | `com.tripzone.controller` | `InquiryController` |
| controller | `com.tripzone.controller` | `LodgingController` |
| controller | `com.tripzone.controller` | `SellerController` |
| domain | `com.tripzone.domain` | `Booking` |
| domain | `com.tripzone.domain` | `Inquiry` |
| domain | `com.tripzone.domain` | `Lodging` |
| domain | `com.tripzone.domain` | `User` |
| dto/auth | `com.tripzone.dto.auth` | `LoginRequest` |
| dto/auth | `com.tripzone.dto.auth` | `SignupRequest` |
| dto/auth | `com.tripzone.dto.auth` | `UserResponse` |
| dto/booking | `com.tripzone.dto.booking` | `BookingRequest` |
| dto/booking | `com.tripzone.dto.booking` | `BookingResponse` |
| dto/inquiry | `com.tripzone.dto.inquiry` | `InquiryRequest` |
| dto/inquiry | `com.tripzone.dto.inquiry` | `InquiryResponse` |
| dto/lodging | `com.tripzone.dto.lodging` | `LodgingRequest` |
| dto/lodging | `com.tripzone.dto.lodging` | `LodgingResponse` |
| repository | `com.tripzone.repository` | `BookingRepository` |
| repository | `com.tripzone.repository` | `InquiryRepository` |
| repository | `com.tripzone.repository` | `LodgingRepository` |
| repository | `com.tripzone.repository` | `UserRepository` |
| service | `com.tripzone.service` | `AuthService` |
| service | `com.tripzone.service` | `BookingService` |
| service | `com.tripzone.service` | `InquiryService` |
| service | `com.tripzone.service` | `LodgingService` |

## 2. 프론트 구조 명세

### 2-1. 진입 / 라우팅 / 전역 상태

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| app | `frontend/src` | `App.jsx` |
| app | `frontend/src` | `main.jsx` |
| router | `frontend/src/router` | `AppRouter.jsx` |
| store | `frontend/src/store` | `authContext.js` |
| store | `frontend/src/store` | `authStore.jsx` |
| hooks | `frontend/src/hooks` | `useAuth.js` |
| styles | `frontend/src/styles` | `tokens.js` |

### 2-2. API 모듈

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| api | `frontend/src/api` | `admin.js` |
| api | `frontend/src/api` | `apiClient.js` |
| api | `frontend/src/api` | `auth.js` |
| api | `frontend/src/api` | `booking.js` |
| api | `frontend/src/api` | `inquiry.js` |
| api | `frontend/src/api` | `lodging.js` |
| api | `frontend/src/api` | `seller.js` |

### 2-3. 공통 컴포넌트

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| component/common | `frontend/src/components/common` | `Badge.jsx` |
| component/common | `frontend/src/components/common` | `DashboardSection.jsx` |
| component/common | `frontend/src/components/common` | `DashboardStatCard.jsx` |
| component/common | `frontend/src/components/common` | `DataTable.jsx` |
| component/common | `frontend/src/components/common` | `EmptyState.jsx` |
| component/common | `frontend/src/components/common` | `FilterChips.jsx` |
| component/common | `frontend/src/components/common` | `ListPageHeader.jsx` |
| component/common | `frontend/src/components/common` | `StatusBadge.jsx` |

### 2-4. 레이아웃 / 보호 라우트

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| component/layout | `frontend/src/components/layout` | `Footer.jsx` |
| component/layout | `frontend/src/components/layout` | `Header.jsx` |
| component/layout | `frontend/src/components/layout` | `LogoMark.jsx` |
| component/layout | `frontend/src/components/layout` | `ProtectedRoute.jsx` |

### 2-5. 도메인 컴포넌트

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| component/booking | `frontend/src/components/booking` | `BookingForm.jsx` |
| component/booking | `frontend/src/components/booking` | `BookingSummary.jsx` |
| component/booking | `frontend/src/components/booking` | `BookingSummaryCard.jsx` |
| component/booking | `frontend/src/components/booking` | `GuestCounter.jsx` |
| component/home | `frontend/src/components/home` | `HomeSections.jsx` |
| component/lodging | `frontend/src/components/lodging` | `LodgingCard.jsx` |
| component/lodging | `frontend/src/components/lodging` | `LodgingMap.jsx` |
| component/lodging | `frontend/src/components/lodging` | `LodgingSearchBar.jsx` |
| component/lodging | `frontend/src/components/lodging` | `SearchBar.jsx` |
| component/mypage | `frontend/src/components/mypage` | `UserTabSections.jsx` |

### 2-6. 상수 / mock / utils

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| constants | `frontend/src/constants` | `inquiryTypes.js` |
| constants | `frontend/src/constants` | `roles.js` |
| mock | `frontend/src/mock` | `benefitsData.js` |
| mock | `frontend/src/mock` | `eventData.js` |
| mock | `frontend/src/mock` | `mockData.js` |
| mock | `frontend/src/mock` | `overseasMockData.js` |
| mock | `frontend/src/mock` | `promotionData.js` |
| utils | `frontend/src/utils` | `attendanceMock.js` |
| utils | `frontend/src/utils` | `benefitNavigation.js` |

### 2-7. 페이지 구조

#### common 페이지

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| page/common | `frontend/src/pages/common` | `AttendancePage.jsx` |
| page/common | `frontend/src/pages/common` | `BenefitsPage.jsx` |
| page/common | `frontend/src/pages/common` | `CouponsPage.jsx` |
| page/common | `frontend/src/pages/common` | `EventDetailPage.jsx` |
| page/common | `frontend/src/pages/common` | `EventsPage.jsx` |
| page/common | `frontend/src/pages/common` | `HomePage.jsx` |
| page/common | `frontend/src/pages/common` | `LoginPage.jsx` |
| page/common | `frontend/src/pages/common` | `MyPage.jsx` |
| page/common | `frontend/src/pages/common` | `OverseasLodgingDetailPage.jsx` |
| page/common | `frontend/src/pages/common` | `OverseasPage.jsx` |
| page/common | `frontend/src/pages/common` | `PointsPage.jsx` |
| page/common | `frontend/src/pages/common` | `PromotionDetailPage.jsx` |
| page/common | `frontend/src/pages/common` | `PromotionsPage.jsx` |
| page/common | `frontend/src/pages/common` | `RecentViewedPage.jsx` |
| page/common | `frontend/src/pages/common` | `ServiceReadyPage.jsx` |
| page/common | `frontend/src/pages/common` | `SettingsPage.jsx` |
| page/common | `frontend/src/pages/common` | `SignupPage.jsx` |
| page/common | `frontend/src/pages/common` | `SupportCenterPage.jsx` |
| page/common | `frontend/src/pages/common` | `WishlistPage.jsx` |

#### user 페이지

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| page/user | `frontend/src/pages/user` | `BookingCompletePage.jsx` |
| page/user | `frontend/src/pages/user` | `BookingPage.jsx` |
| page/user | `frontend/src/pages/user` | `InquiryCreatePage.jsx` |
| page/user | `frontend/src/pages/user` | `LodgingDetailPage.jsx` |
| page/user | `frontend/src/pages/user` | `LodgingListPage.jsx` |
| page/user | `frontend/src/pages/user` | `MyBookingsPage.jsx` |
| page/user | `frontend/src/pages/user` | `MyInquiriesPage.jsx` |

#### seller 페이지

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| page/seller | `frontend/src/pages/seller` | `SellerDashboardPage.jsx` |
| page/seller | `frontend/src/pages/seller` | `SellerInquiryPage.jsx` |
| page/seller | `frontend/src/pages/seller` | `SellerLodgingCreatePage.jsx` |
| page/seller | `frontend/src/pages/seller` | `SellerLodgingEditPage.jsx` |
| page/seller | `frontend/src/pages/seller` | `SellerLodgingListPage.jsx` |
| page/seller | `frontend/src/pages/seller` | `SellerReservationListPage.jsx` |

#### admin 페이지

| 구분 | 경로 | 파일명 |
| :-- | :-- | :-- |
| page/admin | `frontend/src/pages/admin` | `AdminDashboardPage.jsx` |
| page/admin | `frontend/src/pages/admin` | `AdminInquiryListPage.jsx` |
| page/admin | `frontend/src/pages/admin` | `AdminSellerListPage.jsx` |
| page/admin | `frontend/src/pages/admin` | `AdminUserListPage.jsx` |

## 3. 현재 핵심 도메인 기준

| 도메인 | 현재 백엔드 기준 명칭 | 프론트 주요 연결 위치 |
| :-- | :-- | :-- |
| 회원 | `User` | `auth.js`, `MyPage.jsx`, `Header.jsx` |
| 숙소 | `Lodging` | `lodging.js`, `LodgingListPage.jsx`, `LodgingDetailPage.jsx` |
| 예약 | `Booking` | `booking.js`, `BookingPage.jsx`, `MyBookingsPage.jsx` |
| 문의 | `Inquiry` | `inquiry.js`, `InquiryCreatePage.jsx`, `MyInquiriesPage.jsx` |

## 4. 참고

- 이 문서는 `현재 실제 파일 기준` 명세서입니다.
- 아직 없는 클래스/패키지/도메인은 문서에 넣지 않았습니다.
