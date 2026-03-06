import { C, R, S } from '../../styles/tokens';

export default function BookingSummary({ lodging, nights, totalPrice }) {
  return (
    <div style={s.card}>
      {lodging.thumbnailUrl && (
        <img src={lodging.thumbnailUrl} alt={lodging.name} style={s.img} />
      )}
      <p style={s.region}>{lodging.region}</p>
      <p style={s.name}>{lodging.name}</p>
      <hr style={s.hr} />
      <div style={s.row}>
        <span>{(lodging.pricePerNight || 0).toLocaleString()}원 × {nights || 0}박</span>
        <span>{((lodging.pricePerNight || 0) * (nights || 0)).toLocaleString()}원</span>
      </div>
      <hr style={s.hr} />
      <div style={{ ...s.row, fontWeight: '700', fontSize: '16px' }}>
        <span>총 합계</span>
        <span>{totalPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
}

const s = {
  card: { border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', boxShadow: S.card },
  img: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: R.lg, display: 'block', marginBottom: '16px' },
  region: { fontSize: '12px', color: C.textSub, margin: '0 0 4px' },
  name: { fontSize: '16px', fontWeight: '700', color: C.text, margin: 0 },
  hr: { border: 'none', borderTop: `1px solid ${C.borderLight}`, margin: '20px 0' },
  row: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: C.text },
};
