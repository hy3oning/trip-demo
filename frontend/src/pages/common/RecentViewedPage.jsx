import { Link } from 'react-router-dom';
import { MOCK_LODGINGS } from '../../mock/mockData';
import { C, MAX_WIDTH } from '../../styles/tokens';

const RECENT_ITEMS = MOCK_LODGINGS.slice(0, 4);

export default function RecentViewedPage() {
  // TODO(back-end): 최근 본 상품 API가 준비되면 사용자별 조회 이력 순서와 열람 시각을 실제 응답으로 교체한다.
  return (
    <div style={s.page}>
      <div style={s.inner}>
        <div style={s.header}>
          <div>
            <p style={s.eyebrow}>RECENTLY VIEWED</p>
            <h1 style={s.title}>최근 본 상품</h1>
            <p style={s.desc}>최근 확인한 숙소를 다시 비교하고 예약 흐름으로 바로 이어갈 수 있도록 정리했습니다.</p>
          </div>
          <Link to="/lodgings" style={s.headerBtn}>숙소 둘러보기</Link>
        </div>

        <div style={s.grid}>
          {RECENT_ITEMS.map((item, index) => (
            <article key={item.lodgingId} style={s.card}>
              <img src={item.thumbnailUrl} alt={item.name} style={s.image} />
              <div style={s.body}>
                <div style={s.badges}>
                  <span style={s.badge}>최근 열람</span>
                  <span style={s.badgeSub}>{index === 0 ? '방금 전' : `${index + 1}시간 전`}</span>
                </div>
                <p style={s.region}>{item.region}</p>
                <h2 style={s.name}>{item.name}</h2>
                <p style={s.meta}>★ {item.rating} · 후기 {item.reviewCount}개</p>
                <p style={s.price}>1박 {item.pricePerNight.toLocaleString()}원부터</p>
                <div style={s.actions}>
                  <Link to={`/lodgings/${item.lodgingId}`} style={s.primaryBtn}>다시 보기</Link>
                  <Link to={`/booking/${item.lodgingId}`} style={s.secondaryBtn}>예약하기</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 64px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 10px', fontSize: '34px', fontWeight: '800', color: C.text },
  desc: { margin: 0, fontSize: '15px', color: C.textSub, lineHeight: 1.7, maxWidth: '680px' },
  headerBtn: { padding: '12px 18px', borderRadius: '999px', textDecoration: 'none', border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: '700' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' },
  card: { borderRadius: '22px', overflow: 'hidden', background: '#fff', border: `1px solid ${C.borderLight}`, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.05)' },
  image: { width: '100%', height: '200px', objectFit: 'cover', display: 'block' },
  body: { padding: '18px' },
  badges: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' },
  badge: { fontSize: '11px', fontWeight: '800', padding: '5px 8px', borderRadius: '999px', background: '#FFF1F1', color: C.primary },
  badgeSub: { fontSize: '12px', color: C.textLight, fontWeight: '700' },
  region: { margin: '0 0 4px', fontSize: '12px', color: C.textSub },
  name: { margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: C.text },
  meta: { margin: '0 0 10px', fontSize: '13px', color: C.textSub },
  price: { margin: '0 0 14px', fontSize: '15px', fontWeight: '800', color: C.text },
  actions: { display: 'flex', gap: '10px' },
  primaryBtn: { flex: 1, textAlign: 'center', padding: '11px 14px', borderRadius: '12px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '14px' },
  secondaryBtn: { flex: 1, textAlign: 'center', padding: '11px 14px', borderRadius: '12px', background: '#fff', color: C.text, textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: `1px solid ${C.border}` },
};
