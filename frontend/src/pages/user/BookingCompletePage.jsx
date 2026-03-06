import { useLocation, useNavigate, Link } from 'react-router-dom';
import { C, R, S } from '../../styles/tokens';

export default function BookingCompletePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) { navigate('/'); return null; }
  const { lodgingName, checkIn, checkOut, guests, totalPrice } = state;

  const rows = [
    { label: '숙소', value: lodgingName },
    { label: '체크인', value: checkIn },
    { label: '체크아웃', value: checkOut },
    { label: '인원', value: `${guests}명` },
  ];

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.iconCircle}>✓</div>
        <h1 style={s.title}>예약이 완료되었습니다!</h1>
        <p style={s.sub}>예약 확인 내용을 마이페이지에서 확인하세요.</p>

        <div style={s.infoCard}>
          {rows.map(r => (
            <div key={r.label} style={s.infoRow}>
              <span style={s.infoKey}>{r.label}</span>
              <span style={s.infoValue}>{r.value}</span>
            </div>
          ))}
          <div style={{ ...s.infoRow, borderBottom: 'none' }}>
            <span style={s.infoKey}>결제 금액</span>
            <span style={{ ...s.infoValue, color: C.primary, fontWeight: '700', fontSize: '18px' }}>
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        <div style={s.btnGroup}>
          <Link to="/my/bookings" style={s.primaryBtn}>내 예약 확인하기</Link>
          <Link to="/" style={s.secondaryBtn}>홈으로 가기</Link>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: 'calc(100vh - 160px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    background: C.bgGray,
  },
  card: {
    background: C.bg,
    borderRadius: '20px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
    boxShadow: S.card,
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: C.primary,
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: { fontSize: '24px', fontWeight: '700', color: C.text, margin: '0 0 8px' },
  sub: { fontSize: '14px', color: C.textSub, margin: '0 0 32px' },
  infoCard: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: R.lg,
    overflow: 'hidden',
    marginBottom: '32px',
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: `1px solid ${C.borderLight}`,
  },
  infoKey: { fontSize: '13px', color: C.textSub, fontWeight: '500' },
  infoValue: { fontSize: '14px', color: C.text, fontWeight: '600' },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  primaryBtn: {
    display: 'block',
    padding: '14px',
    background: C.primary,
    color: '#fff',
    borderRadius: R.md,
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
  },
  secondaryBtn: {
    display: 'block',
    padding: '14px',
    background: C.bgGray,
    color: C.text,
    borderRadius: R.md,
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
  },
};
