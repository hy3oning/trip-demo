import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../constants/roles';
import { getMyBookings } from '../../api/booking';
import { benefitSnapshot } from '../../mock/benefitsData';
import {
  BookingsList,
  CouponsSection,
  GradeSection,
  MyInfoSection,
  PointsSection,
  SettingsSection,
  WishlistSection,
} from '../../components/mypage/UserTabSections';
import { C } from '../../styles/tokens';

const USER_TABS = [
  { key: 'bookings', label: '예약 내역' },
  { key: 'wishlist', label: '찜 목록' },
  { key: 'grade', label: '등급 혜택' },
  { key: 'points', label: '포인트' },
  { key: 'coupons', label: '쿠폰' },
  { key: 'myinfo', label: '내 정보 관리' },
  { key: 'settings', label: '설정' },
];

const SELLER_TABS = [
  { key: 'lodgings', label: '내 숙소', to: '/seller/lodgings' },
  { key: 'reservations', label: '예약 현황', to: '/seller/reservations' },
  { key: 'inquiries', label: '문의 관리', to: '/seller/inquiries' },
];

const roleLabelMap = {
  [ROLES.USER]: '일반 사용자',
  [ROLES.SELLER]: '판매자',
  [ROLES.ADMIN]: '관리자',
};

export default function MyPage() {
  const { user, logout, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  // TODO(back-end): 사용자 혜택 API가 준비되면 benefitSnapshot 기반 영역을 서버 데이터로 교체한다.

  useEffect(() => {
    if (user?.role === ROLES.USER) {
      getMyBookings(user.userId || 1).then((res) => setBookings(res.data)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <aside style={s.sidebar}>
          <div style={s.profile}>
            <div style={s.avatar}>{user.name[0]}</div>
            <div>
              <p style={s.profileName}>{user.name}</p>
              <p style={s.profileEmail}>{user.email}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={s.roleBadge}>{roleLabelMap[user.role]}</span>
                {user.role === ROLES.USER ? <span style={s.gradeBadge}>{benefitSnapshot.currentGrade} 등급</span> : null}
              </div>
            </div>
          </div>

          <nav style={s.sideNav}>
            {user.role === ROLES.USER ? USER_TABS.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                style={{ ...s.navItem, background: tab === item.key ? C.bgGray : 'transparent', fontWeight: tab === item.key ? '700' : '400' }}
              >
                {item.label}
              </button>
            )) : null}

            {user.role === ROLES.USER ? (
              <Link to="/inquiry/create" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block', marginTop: '4px' }}>
                + 문의하기
              </Link>
            ) : null}

            {user.role === ROLES.SELLER ? SELLER_TABS.map((item) => (
              <Link key={item.key} to={item.to} style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                {item.label}
              </Link>
            )) : null}

            {user.role === ROLES.ADMIN ? (
              <Link to="/admin" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                관리자 대시보드
              </Link>
            ) : null}
          </nav>

          <button onClick={handleLogout} style={s.logoutBtn}>로그아웃</button>
        </aside>

        <main style={s.content}>
          {user.role === ROLES.USER ? (
            <>
              <h2 style={s.contentTitle}>{USER_TABS.find((item) => item.key === tab)?.label}</h2>
              {tab === 'bookings' ? <BookingsList bookings={bookings} /> : null}
              {tab === 'wishlist' ? <WishlistSection /> : null}
              {tab === 'grade' ? <GradeSection /> : null}
              {tab === 'points' ? <PointsSection /> : null}
              {tab === 'coupons' ? <CouponsSection /> : null}
              {tab === 'myinfo' ? <MyInfoSection user={user} logout={handleLogout} updateCurrentUser={updateCurrentUser} /> : null}
              {tab === 'settings' ? <SettingsSection /> : null}
            </>
          ) : null}

          {user.role === ROLES.SELLER ? (
            <>
              <h2 style={s.contentTitle}>판매자 관리</h2>
              <p style={s.helperText}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          ) : null}

          {user.role === ROLES.ADMIN ? (
            <>
              <h2 style={s.contentTitle}>관리자 페이지</h2>
              <p style={s.helperText}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: C.bgWarm, minHeight: 'calc(100vh - 160px)', padding: '56px 24px' },
  inner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '28px', alignItems: 'flex-start' },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: C.bg,
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: `1px solid ${C.borderLight}`,
    position: 'sticky',
    top: '100px',
  },
  profile: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px', paddingBottom: '24px', borderBottom: `1px solid ${C.borderLight}` },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: C.primary,
    color: '#fff',
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(232,72,74,0.3)',
  },
  profileName: { fontSize: '18px', fontWeight: '800', color: C.text, margin: '0 0 4px' },
  profileEmail: { fontSize: '12px', color: C.textSub, margin: '0 0 8px' },
  roleBadge: { fontSize: '11px', fontWeight: '700', background: '#FFF1F1', color: C.primary, padding: '4px 10px', borderRadius: '999px', display: 'inline-block' },
  gradeBadge: { fontSize: '11px', fontWeight: '700', background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: '999px', display: 'inline-block' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '28px' },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '12px 14px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    color: C.text,
    cursor: 'pointer',
    transition: 'background 0.2s',
    outline: 'none',
  },
  logoutBtn: {
    width: '100%',
    padding: '12px',
    background: '#fff',
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: C.textSub,
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    background: C.bg,
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: `1px solid ${C.borderLight}`,
    minHeight: '400px',
  },
  contentTitle: { fontSize: '24px', fontWeight: '800', color: '#1A1A1A', margin: '0 0 32px' },
  helperText: { color: C.textSub, fontSize: '14px' },
};
