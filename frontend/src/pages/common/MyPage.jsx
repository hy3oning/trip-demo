import { useState, useEffect } from 'react';
import { useAuth } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { ROLES } from '../../constants/roles';
import Badge from '../../components/common/Badge';
import { getMyBookings } from '../../api/booking';
import { getMyInquiries } from '../../api/inquiry';
import { C, MAX_WIDTH, R, S } from '../../styles/tokens';
import { INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';

const USER_TABS = [
  { key: 'bookings', label: '내 예약' },
  { key: 'inquiries', label: '내 문의' },
];
const SELLER_TABS = [
  { key: 'lodgings', label: '내 숙소', to: '/seller/lodgings' },
  { key: 'reservations', label: '예약 현황', to: '/seller/reservations' },
  { key: 'inquiries', label: '문의 관리', to: '/seller/inquiries' },
];

function BookingsList({ bookings }) {
  if (!bookings.length) return <p style={{ color: C.textSub }}>예약 내역이 없습니다.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {bookings.map(b => (
        <div key={b.bookingId} style={sCard.card}>
          <img src={b.thumbnailUrl} alt={b.lodgingName} style={sCard.img} />
          <div style={sCard.body}>
            <div style={sCard.header}>
              <p style={sCard.name}>{b.lodgingName}</p>
              <Badge status={b.bookingStatus} />
            </div>
            <p style={sCard.meta}>{b.checkIn} ~ {b.checkOut} · {b.guests}명</p>
            <p style={sCard.price}>{b.totalPrice.toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InquiriesList({ inquiries }) {
  if (!inquiries.length) return <p style={{ color: C.textSub }}>문의 내역이 없습니다.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {inquiries.map(i => (
        <div key={i.inquiryId} style={sCard.inquiryCard}>
          <div style={sCard.inquiryTop}>
            <span style={sCard.inquiryTitle}>{i.title}</span>
            <Badge status={i.inquiryStatus} />
          </div>
          <p style={sCard.inquiryMeta}>{INQUIRY_TYPE_LABELS[i.inquiryType]} · {i.createdAt}</p>
        </div>
      ))}
    </div>
  );
}

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (user?.role === ROLES.USER) {
      getMyBookings(user.userId || 1).then(res => setBookings(res.data)).catch(() => {});
      getMyInquiries(user.userId || 1).then(res => setInquiries(res.data)).catch(() => {});
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate('/'); };

  const roleLabelMap = { [ROLES.USER]: '일반 사용자', [ROLES.SELLER]: '판매자', [ROLES.ADMIN]: '관리자' };

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        {/* ── 좌측 사이드바 ── */}
        <aside style={s.sidebar}>
          <div style={s.profile}>
            <div style={s.avatar}>{user.name[0]}</div>
            <div>
              <p style={s.profileName}>{user.name}</p>
              <p style={s.profileEmail}>{user.email}</p>
              <span style={s.roleBadge}>{roleLabelMap[user.role]}</span>
            </div>
          </div>

          <nav style={s.sideNav}>
            {user.role === ROLES.USER && USER_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{ ...s.navItem, background: tab === t.key ? C.bgGray : 'transparent', fontWeight: tab === t.key ? '700' : '400' }}
              >
                {t.label}
              </button>
            ))}

            {user.role === ROLES.USER && (
              <Link to="/inquiry/create" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block', marginTop: '4px' }}>
                + 문의하기
              </Link>
            )}

            {user.role === ROLES.SELLER && SELLER_TABS.map(t => (
              <Link key={t.key} to={t.to} style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                {t.label}
              </Link>
            ))}

            {user.role === ROLES.ADMIN && (
              <Link to="/admin" style={{ ...s.navItem, textDecoration: 'none', color: C.text, display: 'block' }}>
                관리자 대시보드
              </Link>
            )}
          </nav>

          <button onClick={handleLogout} style={s.logoutBtn}>로그아웃</button>
        </aside>

        {/* ── 우측 콘텐츠 ── */}
        <main style={s.content}>
          {user.role === ROLES.USER && (
            <>
              <h2 style={s.contentTitle}>{tab === 'bookings' ? '내 예약' : '내 문의'}</h2>
              {tab === 'bookings' && <BookingsList bookings={bookings} />}
              {tab === 'inquiries' && <InquiriesList inquiries={inquiries} />}
            </>
          )}
          {user.role === ROLES.SELLER && (
            <>
              <h2 style={s.contentTitle}>판매자 관리</h2>
              <p style={{ color: C.textSub, fontSize: '14px' }}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          )}
          {user.role === ROLES.ADMIN && (
            <>
              <h2 style={s.contentTitle}>관리자 페이지</h2>
              <p style={{ color: C.textSub, fontSize: '14px' }}>좌측 메뉴에서 항목을 선택하세요.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: C.bgGray, minHeight: 'calc(100vh - 160px)', padding: '48px 24px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    background: C.bg,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: S.card,
    position: 'sticky',
    top: '100px',
  },
  profile: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${C.borderLight}` },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: C.primary,
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileName: { fontSize: '16px', fontWeight: '700', color: C.text, margin: '0 0 2px' },
  profileEmail: { fontSize: '12px', color: C.textSub, margin: '0 0 6px' },
  roleBadge: { fontSize: '11px', fontWeight: '600', background: '#FFF0F3', color: C.primary, padding: '2px 8px', borderRadius: '20px' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' },
  navItem: {
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    border: 'none',
    borderRadius: R.md,
    fontSize: '14px',
    color: C.text,
    cursor: 'pointer',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'none',
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    fontSize: '14px',
    color: C.textSub,
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    background: C.bg,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: S.card,
    minHeight: '400px',
  },
  contentTitle: { fontSize: '22px', fontWeight: '700', color: C.text, margin: '0 0 24px' },
};

const sCard = {
  card: {
    display: 'flex',
    gap: '16px',
    border: `1px solid ${C.borderLight}`,
    borderRadius: R.lg,
    overflow: 'hidden',
    padding: '16px',
  },
  img: { width: '100px', height: '80px', objectFit: 'cover', borderRadius: R.md, flexShrink: 0 },
  body: { flex: 1, minWidth: 0 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  name: { fontSize: '15px', fontWeight: '700', color: C.text, margin: 0 },
  meta: { fontSize: '13px', color: C.textSub, margin: '0 0 4px' },
  price: { fontSize: '14px', fontWeight: '600', color: C.text, margin: 0 },
  inquiryCard: { border: `1px solid ${C.borderLight}`, borderRadius: R.lg, padding: '16px 20px' },
  inquiryTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  inquiryTitle: { fontSize: '15px', fontWeight: '600', color: C.text },
  inquiryMeta: { fontSize: '13px', color: C.textSub, margin: 0 },
};
