import { Link } from 'react-router-dom';
import DashboardSection from '../../components/common/DashboardSection';
import DashboardStatCard from '../../components/common/DashboardStatCard';
import { C } from '../../styles/tokens';

export default function AdminDashboardPage() {
  const dashboardState = {
    loading: false,
    error: '',
    stats: [
      { label: '전체 사용자', value: 128, link: '/admin/users', background: '#eff6ff', description: '가입 회원 기준' },
      { label: '전체 판매자', value: 24, link: '/admin/sellers', background: '#f0fdf4', description: '승인 판매자 포함' },
      { label: '미처리 문의', value: 7, link: '/admin/inquiries', background: '#fef9c3', description: '우선 확인 필요' },
    ],
    quickLinks: [
      { to: '/admin/users', label: '사용자 관리' },
      { to: '/admin/sellers', label: '판매자 관리' },
      { to: '/admin/inquiries', label: '문의 관리' },
    ],
  };
  // TODO(back-end): 관리자 대시보드 요약 API 응답으로 stats, quickLinks를 교체한다.

  return (
    <div style={styles.wrap}>
      <DashboardSection
        title="관리자 대시보드"
        description="핵심 운영 수치를 빠르게 확인하고 바로 관리 화면으로 이동할 수 있습니다."
        loading={dashboardState.loading}
        error={dashboardState.error}
        empty={!dashboardState.stats.length}
      >
        <div style={styles.grid}>
          {dashboardState.stats.map((stat) => (
            <DashboardStatCard key={stat.label} {...stat} />
          ))}
        </div>
        <div style={styles.actions}>
          {dashboardState.quickLinks.map((item) => (
            <Link to={item.to} key={item.to} style={styles.link}>{item.label}</Link>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '980px', margin: '0 auto', padding: '32px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  actions: { display: 'flex', gap: '12px' },
  link: {
    padding: '12px 20px',
    background: '#fff',
    color: C.text,
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '700',
    border: `1px solid ${C.borderLight}`,
  },
};
