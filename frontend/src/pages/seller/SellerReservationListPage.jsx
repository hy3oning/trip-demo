const MOCK_RESERVATIONS = [
  { bookingId: 1, lodgingName: '한라산 뷰 펜션', guestName: '홍길동', checkIn: '2026-04-10', checkOut: '2026-04-12', guests: 2, totalPrice: 240000, bookingStatus: 'CONFIRMED' },
  { bookingId: 2, lodgingName: '남해 바다 리조트', guestName: '김철수', checkIn: '2026-04-20', checkOut: '2026-04-22', guests: 4, totalPrice: 380000, bookingStatus: 'CONFIRMED' },
  { bookingId: 3, lodgingName: '강릉 해변 호텔', guestName: '이영희', checkIn: '2026-03-15', checkOut: '2026-03-17', guests: 2, totalPrice: 300000, bookingStatus: 'CANCELLED' },
];

const STATUS_LABEL = { CONFIRMED: '예약 확정', CANCELLED: '취소', PENDING: '대기' };
const STATUS_COLOR = { CONFIRMED: '#dcfce7', CANCELLED: '#fee2e2', PENDING: '#fef9c3' };

export default function SellerReservationListPage() {
  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>예약 현황</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>숙소</th>
            <th style={styles.th}>예약자</th>
            <th style={styles.th}>체크인</th>
            <th style={styles.th}>체크아웃</th>
            <th style={styles.th}>인원</th>
            <th style={styles.th}>금액</th>
            <th style={styles.th}>상태</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_RESERVATIONS.map(r => (
            <tr key={r.bookingId} style={styles.tr}>
              <td style={styles.td}>{r.lodgingName}</td>
              <td style={styles.td}>{r.guestName}</td>
              <td style={styles.td}>{r.checkIn}</td>
              <td style={styles.td}>{r.checkOut}</td>
              <td style={styles.td}>{r.guests}명</td>
              <td style={styles.td}>{r.totalPrice.toLocaleString()}원</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, background: STATUS_COLOR[r.bookingStatus] }}>{STATUS_LABEL[r.bookingStatus]}</span>
              </td>
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
