import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ROLES } from '../constants/roles';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// 공통
import HomePage from '../pages/common/HomePage';
import LoginPage from '../pages/common/LoginPage';
import SignupPage from '../pages/common/SignupPage';
import MyPage from '../pages/common/MyPage';

// 사용자
import LodgingListPage from '../pages/user/LodgingListPage';
import LodgingDetailPage from '../pages/user/LodgingDetailPage';
import BookingPage from '../pages/user/BookingPage';
import BookingCompletePage from '../pages/user/BookingCompletePage';
import MyBookingsPage from '../pages/user/MyBookingsPage';
import InquiryCreatePage from '../pages/user/InquiryCreatePage';
import MyInquiriesPage from '../pages/user/MyInquiriesPage';

// 판매자
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerLodgingCreatePage from '../pages/seller/SellerLodgingCreatePage';
import SellerLodgingEditPage from '../pages/seller/SellerLodgingEditPage';
import SellerLodgingListPage from '../pages/seller/SellerLodgingListPage';
import SellerReservationListPage from '../pages/seller/SellerReservationListPage';
import SellerInquiryPage from '../pages/seller/SellerInquiryPage';

// 관리자
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUserListPage from '../pages/admin/AdminUserListPage';
import AdminSellerListPage from '../pages/admin/AdminSellerListPage';
import AdminInquiryListPage from '../pages/admin/AdminInquiryListPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
        {/* 공통 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/lodgings" element={<LodgingListPage />} />
        <Route path="/lodgings/:lodgingId" element={<LodgingDetailPage />} />

        {/* 로그인 필요 공통 */}
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

        {/* 사용자 */}
        <Route path="/booking/:lodgingId" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><BookingPage /></ProtectedRoute>} />
        <Route path="/booking/complete" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><BookingCompletePage /></ProtectedRoute>} />
        <Route path="/my/bookings" element={<ProtectedRoute allowedRoles={[ROLES.USER]}><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/inquiry/create" element={<ProtectedRoute><InquiryCreatePage /></ProtectedRoute>} />
        <Route path="/my/inquiries" element={<ProtectedRoute><MyInquiriesPage /></ProtectedRoute>} />

        {/* 판매자 */}
        <Route path="/seller" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerDashboardPage /></ProtectedRoute>} />
        <Route path="/seller/lodgings" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerLodgingListPage /></ProtectedRoute>} />
        <Route path="/seller/lodgings/create" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerLodgingCreatePage /></ProtectedRoute>} />
        <Route path="/seller/lodgings/:lodgingId/edit" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerLodgingEditPage /></ProtectedRoute>} />
        <Route path="/seller/reservations" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerReservationListPage /></ProtectedRoute>} />
        <Route path="/seller/inquiries" element={<ProtectedRoute allowedRoles={[ROLES.SELLER]}><SellerInquiryPage /></ProtectedRoute>} />

        {/* 관리자 */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminUserListPage /></ProtectedRoute>} />
        <Route path="/admin/sellers" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminSellerListPage /></ProtectedRoute>} />
        <Route path="/admin/inquiries" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminInquiryListPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
