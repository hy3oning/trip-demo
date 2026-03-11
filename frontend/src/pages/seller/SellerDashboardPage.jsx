import { Link } from 'react-router-dom';
import DashboardSection from '../../components/common/DashboardSection';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import { useAuth } from '../../hooks/useAuth';
import { C } from '../../styles/tokens';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const dashboardState = {
    loading: false,
    error: '',
    stats: [
      { label: '등록 숙소', value: 3, link: '/seller/lodgings', background: '#eff6ff', description: '현재 노출 중 숙소' },
      { label: '총 예약', value: 12, link: '/seller/reservations', background: '#f0fdf4', description: '이번 달 기준' },
      { label: '미처리 문의', value: 2, link: '/seller/inquiries', background: '#fef9c3', description: '빠른 응답 권장' },
    ],
  };
  // TODO(back-end): 판매자 대시보드 요약 API 응답으로 stats를 교체한다.

  return (
    <div style={styles.wrap}>
      <DashboardSection
        title="판매자 대시보드"
        description={`안녕하세요, ${user?.name || '판매자'}님. 오늘 확인할 운영 현황입니다.`}
        loading={dashboardState.loading}
        error={dashboardState.error}
        empty={!dashboardState.stats.length}
      >
        <div style={styles.statsGrid}>
          {dashboardState.stats.map((stat) => (
            <DashboardStatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div style={styles.actions}>
          <Link to="/seller/lodgings/create" style={styles.primaryBtn}>+ 숙소 등록</Link>
          <Link to="/seller/reservations" style={styles.secondaryBtn}>예약 현황 보기</Link>
          <Link to="/inquiry/create" style={styles.secondaryBtn}>관리자 문의</Link>
        </div>
      </DashboardSection>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '980px', margin: '0 auto', padding: '32px 24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  primaryBtn: { padding: '12px 20px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' },
  secondaryBtn: {
    padding: '12px 20px',
    background: '#fff',
    color: C.text,
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '700',
    border: `1px solid ${C.borderLight}`,
  },
};
