import { useState } from 'react';
import { INQUIRY_TYPE_LABELS } from '../../constants/inquiryTypes';

const MOCK_INQUIRIES = [
  { inquiryId: 1, senderName: '홍길동', inquiryType: 'USER_TO_SELLER', title: '주차 가능한가요?', inquiryStatus: 'PENDING', createdAt: '2026-03-01' },
  { inquiryId: 2, senderName: '김판매', inquiryType: 'SELLER_TO_ADMIN', title: '숙소 등록 오류 문의', inquiryStatus: 'ANSWERED', createdAt: '2026-03-02' },
  { inquiryId: 3, senderName: '이영희', inquiryType: 'COMMON_TO_ADMIN', title: '로그인이 안 됩니다', inquiryStatus: 'PENDING', createdAt: '2026-03-04' },
  { inquiryId: 4, senderName: '박사장', inquiryType: 'SELLER_TO_ADMIN', title: '정산 관련 문의', inquiryStatus: 'PENDING', createdAt: '2026-03-05' },
];

const STATUS_COLOR = { ANSWERED: '#dcfce7', PENDING: '#fef9c3' };
const STATUS_LABEL = { ANSWERED: '답변 완료', PENDING: '대기 중' };

export default function AdminInquiryListPage() {
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? MOCK_INQUIRIES : MOCK_INQUIRIES.filter(i => i.inquiryType === filter);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>문의 관리</h2>
        <div style={styles.filterGroup}>
          {['ALL', 'USER_TO_SELLER', 'SELLER_TO_ADMIN', 'COMMON_TO_ADMIN'].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ ...styles.filterBtn, background: filter === t ? '#2563eb' : '#f3f4f6', color: filter === t ? '#fff' : '#374151' }}>
              {t === 'ALL' ? '전체' : INQUIRY_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>문의자</th><th style={styles.th}>유형</th><th style={styles.th}>제목</th><th style={styles.th}>상태</th><th style={styles.th}>접수일</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(i => (
            <tr key={i.inquiryId} style={styles.tr}>
              <td style={styles.td}>{i.senderName}</td>
              <td style={styles.td}>{INQUIRY_TYPE_LABELS[i.inquiryType]}</td>
              <td style={styles.td}>{i.title}</td>
              <td style={styles.td}><span style={{ ...styles.badge, background: STATUS_COLOR[i.inquiryStatus] }}>{STATUS_LABEL[i.inquiryStatus]}</span></td>
              <td style={styles.td}>{i.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '22px', fontWeight: 'bold', margin: 0 },
  filterGroup: { display: 'flex', gap: '8px' },
  filterBtn: { padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f9fafb' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '14px 16px', fontSize: '14px' },
  badge: { fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' },
};
