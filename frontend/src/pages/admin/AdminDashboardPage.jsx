import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const stats = [
    { label: '전체 사용자', value: 128, link: '/admin/users', color: '#eff6ff' },
    { label: '전체 판매자', value: 24, link: '/admin/sellers', color: '#f0fdf4' },
    { label: '미처리 문의', value: 7, link: '/admin/inquiries', color: '#fef9c3' },
  ];

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>관리자 대시보드</h2>
      <div style={styles.grid}>
        {stats.map(s => (
          <Link to={s.link} key={s.label} style={{ ...styles.card, background: s.color }}>
            <p style={styles.cardLabel}>{s.label}</p>
            <p style={styles.cardValue}>{s.value}</p>
          </Link>
        ))}
      </div>
      <div style={styles.actions}>
        <Link to="/admin/users" style={styles.link}>사용자 관리</Link>
        <Link to="/admin/sellers" style={styles.link}>판매자 관리</Link>
        <Link to="/admin/inquiries" style={styles.link}>문의 관리</Link>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  card: { padding: '24px', borderRadius: '12px', textDecoration: 'none', border: '1px solid #e5e7eb', display: 'block' },
  cardLabel: { fontSize: '14px', color: '#6b7280', margin: '0 0 8px' },
  cardValue: { fontSize: '32px', fontWeight: 'bold', color: '#111', margin: 0 },
  actions: { display: 'flex', gap: '12px' },
  link: { padding: '12px 20px', background: '#f3f4f6', color: '#374151', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' },
};
