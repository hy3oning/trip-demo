const MOCK_USERS = [
  { userId: 1, name: '홍길동', email: 'user1@test.com', role: 'USER', createdAt: '2026-01-10' },
  { userId: 2, name: '김철수', email: 'user2@test.com', role: 'USER', createdAt: '2026-01-15' },
  { userId: 3, name: '이영희', email: 'user3@test.com', role: 'USER', createdAt: '2026-02-01' },
];

export default function AdminUserListPage() {
  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>사용자 목록</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>ID</th><th style={styles.th}>이름</th><th style={styles.th}>이메일</th><th style={styles.th}>역할</th><th style={styles.th}>가입일</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_USERS.map(u => (
            <tr key={u.userId} style={styles.tr}>
              <td style={styles.td}>{u.userId}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}><span style={styles.badge}>{u.role}</span></td>
              <td style={styles.td}>{u.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f9fafb' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 16px', fontSize: '14px' },
  badge: { background: '#eff6ff', color: '#2563eb', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' },
};
