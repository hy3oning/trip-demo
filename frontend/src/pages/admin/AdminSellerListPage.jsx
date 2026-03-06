const MOCK_SELLERS = [
  { sellerId: 1, name: '김판매', email: 'seller1@test.com', businessName: '제주 숙소 운영', approvalStatus: 'APPROVED', createdAt: '2026-01-05' },
  { sellerId: 2, name: '박사장', email: 'seller2@test.com', businessName: '경남 리조트', approvalStatus: 'APPROVED', createdAt: '2026-02-10' },
  { sellerId: 3, name: '최신규', email: 'seller3@test.com', businessName: '강원 펜션', approvalStatus: 'PENDING', createdAt: '2026-03-01' },
];

const STATUS_COLOR = { APPROVED: '#dcfce7', PENDING: '#fef9c3', REJECTED: '#fee2e2' };
const STATUS_LABEL = { APPROVED: '승인', PENDING: '대기', REJECTED: '거절' };

export default function AdminSellerListPage() {
  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>판매자 목록</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>ID</th><th style={styles.th}>이름</th><th style={styles.th}>이메일</th><th style={styles.th}>사업체명</th><th style={styles.th}>상태</th><th style={styles.th}>가입일</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_SELLERS.map(s => (
            <tr key={s.sellerId} style={styles.tr}>
              <td style={styles.td}>{s.sellerId}</td>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.email}</td>
              <td style={styles.td}>{s.businessName}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: STATUS_COLOR[s.approvalStatus] }}>{STATUS_LABEL[s.approvalStatus]}</span></td>
              <td style={styles.td}>{s.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f9fafb' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 16px', fontSize: '14px' },
  badge: { fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' },
};
