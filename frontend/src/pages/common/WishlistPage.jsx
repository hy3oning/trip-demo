import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function WishlistPage() {
  // TODO(back-end): 찜 목록 API가 준비되면 사용자별 wishlist 상태와 저장 시각을 실제 응답으로 연결한다.
  const { wishlistItems, removeWishlistItem } = useWishlist();
  const averagePrice = wishlistItems.length
    ? Math.round(wishlistItems.reduce((acc, item) => acc + item.pricePerNight, 0) / wishlistItems.length)
    : 0;

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.hero}>
          <div>
            <p style={s.eyebrow}>MY WISHLIST</p>
            <h1 style={s.title}>찜 목록</h1>
            <p style={s.desc}>비교하고 싶은 숙소를 모아두고 가격과 분위기를 한 번에 확인할 수 있게 구성했습니다.</p>
          </div>
          <Link to="/lodgings" style={s.heroBtn}>더 둘러보기</Link>
        </div>

        <div style={s.summary}>
          <div style={s.summaryCard}>
            <p style={s.summaryLabel}>저장한 숙소</p>
            <p style={s.summaryValue}>{wishlistItems.length}곳</p>
          </div>
          <div style={s.summaryCard}>
            <p style={s.summaryLabel}>평균 가격대</p>
            <p style={s.summaryValue}>{averagePrice.toLocaleString()}원</p>
          </div>
        </div>

        {!wishlistItems.length ? (
          <div style={s.emptyCard}>
            <p style={s.emptyTitle}>아직 찜한 숙소가 없습니다.</p>
            <p style={s.emptyDesc}>메인 화면이나 숙소 목록에서 하트를 눌러 찜 목록을 채워보세요.</p>
            <Link to="/lodgings" style={s.primaryBtn}>숙소 둘러보기</Link>
          </div>
        ) : (
          <div style={s.list}>
            {wishlistItems.map((item) => (
            <article key={item.lodgingId} style={s.row}>
              <img src={item.thumbnailUrl} alt={item.name} style={s.image} />
              <div style={s.info}>
                <p style={s.region}>{item.region}</p>
                <h2 style={s.name}>{item.name}</h2>
                <p style={s.meta}>{item.address}</p>
                <p style={s.meta}>★ {item.rating} · 후기 {item.reviewCount}개</p>
              </div>
              <div style={s.side}>
                <p style={s.price}>1박 {item.pricePerNight.toLocaleString()}원</p>
                <div style={s.actions}>
                  <Link to={`/lodgings/${item.lodgingId}`} style={s.secondaryBtn}>상세 보기</Link>
                  <button type="button" style={s.deleteBtn} onClick={() => removeWishlistItem(item.lodgingId)}>삭제</button>
                  <Link to={`/booking/${item.lodgingId}`} style={s.primaryBtn}>예약하기</Link>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 64px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 10px', fontSize: '34px', fontWeight: '800', color: C.text },
  desc: { margin: 0, fontSize: '15px', color: C.textSub, lineHeight: 1.7, maxWidth: '720px' },
  heroBtn: { padding: '12px 18px', borderRadius: '999px', textDecoration: 'none', border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: '700' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' },
  summaryCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '18px', padding: '18px 20px' },
  summaryLabel: { margin: 0, fontSize: '13px', color: C.textSub, fontWeight: '700' },
  summaryValue: { margin: '10px 0 0', fontSize: '28px', color: C.text, fontWeight: '800' },
  emptyCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '22px', padding: '40px 24px', textAlign: 'center' },
  emptyTitle: { margin: '0 0 10px', fontSize: '24px', color: C.text, fontWeight: '800' },
  emptyDesc: { margin: '0 0 18px', fontSize: '14px', color: C.textSub, lineHeight: 1.7 },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  row: { display: 'grid', gridTemplateColumns: '220px 1fr auto', gap: '18px', alignItems: 'center', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '16px' },
  image: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '14px' },
  info: { minWidth: 0 },
  region: { margin: '0 0 4px', fontSize: '12px', color: C.textSub },
  name: { margin: '0 0 8px', fontSize: '22px', fontWeight: '800', color: C.text },
  meta: { margin: '0 0 6px', fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  side: { minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' },
  price: { margin: 0, fontSize: '18px', fontWeight: '800', color: C.text },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  primaryBtn: { padding: '10px 14px', borderRadius: '12px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '13px' },
  secondaryBtn: { padding: '10px 14px', borderRadius: '12px', background: '#fff', color: C.text, textDecoration: 'none', fontWeight: '700', fontSize: '13px', border: `1px solid ${C.border}` },
  deleteBtn: { padding: '10px 14px', borderRadius: '12px', background: '#FFF4F4', color: '#D54B4D', fontWeight: '700', fontSize: '13px', border: '1px solid #F2C6C7', cursor: 'pointer' },
};
