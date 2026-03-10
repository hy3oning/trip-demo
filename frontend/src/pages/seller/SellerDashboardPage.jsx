import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const stats = [
    { label: '등록 숙소', value: 3, link: '/seller/lodgings', color: '#eff6ff' },
    { label: '총 예약', value: 12, link: '/seller/reservations', color: '#f0fdf4' },
    { label: '미처리 문의', value: 2, link: '/seller/inquiries', color: '#fef9c3' },
  ];

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>판매자 대시보드</h2>
      <p style={styles.sub}>안녕하세요, {user?.name}님</p>

      <div style={styles.statsGrid}>
        {stats.map(s => (
          <Link to={s.link} key={s.label} style={{ ...styles.statCard, background: s.color }}>
            <p style={styles.statLabel}>{s.label}</p>
            <p style={styles.statValue}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div style={styles.actions}>
        <Link to="/seller/lodgings/create" style={styles.primaryBtn}>+ 숙소 등록</Link>
        <Link to="/seller/reservations" style={styles.secondaryBtn}>예약 현황 보기</Link>
        <Link to="/inquiry/create" style={styles.secondaryBtn}>관리자 문의</Link>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' },
  sub: { color: '#6b7280', marginBottom: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { padding: '24px', borderRadius: '12px', textDecoration: 'none', border: '1px solid #e5e7eb', display: 'block' },
  statLabel: { fontSize: '14px', color: '#6b7280', margin: '0 0 8px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#111', margin: 0 },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primaryBtn: { padding: '12px 20px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  secondaryBtn: { padding: '12px 20px', background: '#f3f4f6', color: '#374151', borderRadius: '8px', textDecoration: 'none' },
};
