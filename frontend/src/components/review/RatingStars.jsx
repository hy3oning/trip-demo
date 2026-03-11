export default function RatingStars({ value = 0, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ color: star <= value ? '#F59E0B' : '#D1D5DB', fontSize: `${size}px`, lineHeight: 1 }}>
          ★
        </span>
      ))}
    </span>
  );
}
