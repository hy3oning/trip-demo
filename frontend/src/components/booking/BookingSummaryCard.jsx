import { C, R, S } from '../../styles/tokens';

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [inY, inM, inD] = String(checkIn).split('-').map(Number);
  const [outY, outM, outD] = String(checkOut).split('-').map(Number);
  if (!inY || !inM || !inD || !outY || !outM || !outD) return 0;
  const inUtc = Date.UTC(inY, inM - 1, inD);
  const outUtc = Date.UTC(outY, outM - 1, outD);
  return Math.max(0, Math.floor((outUtc - inUtc) / 86400000));
}

export default function BookingSummaryCard({ lodging, checkIn, checkOut, guests, onBook, hideSelectionSummary = false }) {
  const nights = calcNights(checkIn, checkOut);
  const totalPrice = nights * (lodging?.pricePerNight || 0);

  return (
    <div style={s.card} className="tz-summary-card">
      <style>{`
        @media (max-width: 980px) {
          .tz-summary-card {
            position: static !important;
          }
        }
        .tz-book-btn {
          transition: transform .14s ease, box-shadow .14s ease, filter .14s ease;
        }
        .tz-book-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(232,72,74,0.32);
          filter: saturate(1.04);
        }
      `}</style>
      {/* 가격 헤더 */}
      <div style={s.priceRow}>
        <span style={s.price}>{lodging?.pricePerNight?.toLocaleString()}원</span>
        <span style={s.perNight}> / 1박</span>
      </div>

      <div style={s.totalHint}>
        {nights > 0
          ? `선택 일정 ${nights}박 · 총 ${totalPrice.toLocaleString()}원`
          : '체크인/체크아웃 날짜를 선택하면 총액이 계산됩니다.'}
      </div>

      {!hideSelectionSummary && (
        <>
          <div style={s.dateSummary}>
            <div style={s.dateCell}>
              <div style={s.dateLabel}>체크인</div>
              <div style={s.dateValue}>{checkIn || '날짜 선택'}</div>
            </div>
            <div style={s.dateDivider} />
            <div style={s.dateCell}>
              <div style={s.dateLabel}>체크아웃</div>
              <div style={s.dateValue}>{checkOut || '날짜 선택'}</div>
            </div>
          </div>
          <div style={s.guestSummary}>
            <span style={s.dateLabel}>인원</span>
            <span style={s.dateValue}>{guests}명</span>
          </div>
        </>
      )}

      {/* 예약 버튼 */}
      <button
        onClick={onBook}
        style={s.bookBtn}
        className="tz-book-btn"
      >
        예약하기
      </button>

      {/* 요금 내역 */}
      {nights > 0 && (
        <div style={s.breakdown}>
          <div style={s.breakdownRow}>
            <span>{lodging?.pricePerNight?.toLocaleString()}원 × {nights}박</span>
            <span>{(lodging.pricePerNight * nights).toLocaleString()}원</span>
          </div>
          <div style={s.breakdownDivider} />
          <div style={{ ...s.breakdownRow, fontWeight: '700' }}>
            <span>총 합계</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: S.card,
    position: 'sticky',
    top: '100px',
  },
  priceRow: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'baseline',
  },
  price: { fontSize: '22px', fontWeight: '700', color: C.text },
  perNight: { fontSize: '14px', color: C.textSub },
  totalHint: {
    marginBottom: '14px',
    fontSize: '13px',
    color: '#4B5563',
    background: '#F9FAFB',
    border: `1px solid ${C.borderLight}`,
    borderRadius: '10px',
    padding: '9px 10px',
  },
  dateSummary: {
    display: 'flex',
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    overflow: 'hidden',
    marginBottom: '8px',
  },
  dateCell: { flex: 1, padding: '10px 12px' },
  dateLabel: { fontSize: '10px', fontWeight: '700', color: C.text, marginBottom: '2px', letterSpacing: '0.05em' },
  dateValue: { fontSize: '13px', color: C.textSub },
  dateDivider: { width: '1px', background: C.border },
  guestSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    padding: '10px 12px',
    marginBottom: '16px',
  },
  bookBtn: {
    width: '100%',
    padding: '14px',
    background: `linear-gradient(to right, ${C.primary}, #E31C5F)`,
    color: '#fff',
    border: 'none',
    borderRadius: R.md,
    fontWeight: '700',
    fontSize: '16px',
    marginBottom: '16px',
    cursor: 'pointer',
  },
  breakdown: {
    borderTop: `1px solid ${C.borderLight}`,
    paddingTop: '16px',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: C.text,
    marginBottom: '8px',
  },
  breakdownDivider: {
    height: '1px',
    background: C.borderLight,
    margin: '12px 0',
  },
};
