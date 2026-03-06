import { Link } from 'react-router-dom';

const MOCK_RECEIVED = [
  { inquiryId: 1, title: '주차 공간이 있나요?', senderName: '홍길동', inquiryStatus: 'PENDING', createdAt: '2026-03-02' },
  { inquiryId: 2, title: '체크인 시간 문의', senderName: '김철수', inquiryStatus: 'ANSWERED', createdAt: '2026-03-04' },
];

const STATUS_LABEL = { ANSWERED: '답변 완료', PENDING: '대기 중' };
const STATUS_COLOR = { ANSWERED: '#dcfce7', PENDING: '#fef9c3' };

export default function SellerInquiryPage() {
  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>문의 관리</h2>
        <Link to="/inquiry/create" style={styles.addBtn}>관리자 문의하기</Link>
      </div>

      <h3 style={styles.sub}>사용자에게 받은 문의</h3>
      <div style={styles.list}>
        {MOCK_RECEIVED.map(i => (
          <div key={i.inquiryId} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>{i.title}</span>
              <span style={{ ...styles.badge, background: STATUS_COLOR[i.inquiryStatus] }}>{STATUS_LABEL[i.inquiryStatus]}</span>
            </div>
            <p style={styles.meta}>문의자: {i.senderName} · {i.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '22px', fontWeight: 'bold', margin: 0 },
  addBtn: { padding: '10px 16px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' },
  sub: { fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px 20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  cardTitle: { fontSize: '15px', fontWeight: '600' },
  badge: { fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' },
  meta: { fontSize: '13px', color: '#6b7280', margin: 0 },
};
