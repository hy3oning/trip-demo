import RatingStars from './RatingStars';
import { C } from '../../styles/tokens';

export default function ReviewCard({ review, onDelete }) {
  return (
    <article style={s.card}>
      <div style={s.header}>
        <div>
          <p style={s.author}>{review.authorName}</p>
          <div style={s.ratingRow}>
            <RatingStars value={review.rating} size={15} />
            <span style={s.date}>{review.createdAt}</span>
          </div>
        </div>
        <div style={s.headerActions}>
          {review.imageUrls?.length ? <span style={s.photoBadge}>사진 {review.imageUrls.length}</span> : null}
          {review.canDelete && onDelete ? (
            <button type="button" style={s.deleteBtn} onClick={() => onDelete(review.reviewId)}>
              삭제
            </button>
          ) : null}
        </div>
      </div>
      <p style={s.content}>{review.content}</p>
      {review.imageUrls?.length ? (
        <div style={s.imageGrid}>
          {review.imageUrls.map((url, index) => (
            <img key={`${review.reviewId}-${index}`} src={url} alt="" style={s.image} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

const s = {
  card: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    padding: '18px 20px',
    background: '#fff',
    boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
  },
  header: { display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', marginBottom: '10px' },
  headerActions: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' },
  author: { margin: '0 0 6px', fontSize: '14px', color: C.text, fontWeight: 800 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  date: { fontSize: '12px', color: C.textSub, fontWeight: 600 },
  photoBadge: {
    fontSize: '11px',
    fontWeight: 800,
    color: C.primary,
    background: '#FFF1F1',
    border: '1px solid #F4C7C8',
    borderRadius: '999px',
    padding: '6px 9px',
    whiteSpace: 'nowrap',
  },
  deleteBtn: {
    border: '1px solid #F2C6C7',
    borderRadius: '999px',
    background: '#FFF4F4',
    color: '#D54B4D',
    fontSize: '11px',
    fontWeight: 800,
    padding: '6px 9px',
    cursor: 'pointer',
  },
  content: { margin: 0, fontSize: '14px', color: '#374151', lineHeight: 1.7 },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '14px' },
  image: { width: '100%', height: '118px', borderRadius: '12px', objectFit: 'cover', display: 'block' },
};
