import { Link } from 'react-router-dom';
import { EVENT_ITEMS } from '../../mock/eventData';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function EventsPage() {
  // TODO(back-end): 이벤트 목록 API가 준비되면 진행중/종료/카테고리 상태값과 함께 서버 응답으로 교체한다.
  return (
    <div style={s.page}>
      <section style={s.hero}>
        <div style={s.inner}>
          <p style={s.eyebrow}>EVENT HUB</p>
          <h1 style={s.title}>이벤트</h1>
          <p style={s.desc}>TripZone에서 참여형 이벤트와 시즌 캠페인을 한눈에 확인하고 바로 참여할 수 있는 이벤트 허브입니다.</p>
          <div style={s.heroActions}>
            <Link to="/promotions" style={s.secondaryBtn}>프로모션 보기</Link>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.grid}>
            {EVENT_ITEMS.map((item) => (
              <Link key={item.slug} to={`/events/${item.slug}`} style={s.card}>
                <div style={{ ...s.thumbWrap, background: item.gradient }}>
                  <div>
                    <p style={s.cardLead}>{item.lead}</p>
                    <h2 style={s.cardTitle}>{item.title}</h2>
                    <p style={s.cardSub}>{item.subtitle}</p>
                  </div>
                  <div style={{ ...s.thumbCircle, background: item.circle }}>
                    <img src={item.imageUrl} alt={item.subtitle} style={s.thumbImage} />
                  </div>
                </div>
                <div style={s.body}>
                  <div style={s.metaRow}>
                    <span style={{ ...s.statusBadge, ...(item.status === '등급전용' ? s.statusBadgeDark : item.status === '오픈예정' ? s.statusBadgeSoon : s.statusBadgeLive) }}>
                      {item.status}
                    </span>
                    <span style={s.audienceText}>{item.audienceLabel}</span>
                  </div>
                  <p style={s.date}>{item.date}</p>
                  <p style={s.bodyDesc}>{item.description}</p>
                  <span style={s.moreBtn}>{item.ctaLabel}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)' },
  hero: { padding: '64px 24px 40px', background: 'linear-gradient(145deg, #FFF6F1 0%, #FFFFFF 52%, #F7F7FF 100%)', borderBottom: '1px solid #F0E8E8' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  eyebrow: { margin: '0 0 12px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 12px', fontSize: '42px', fontWeight: '800', color: C.text },
  desc: { margin: 0, maxWidth: '760px', fontSize: '16px', lineHeight: 1.8, color: C.textSub },
  heroActions: { marginTop: '20px', display: 'flex', gap: '10px' },
  section: { padding: '32px 24px 64px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' },
  card: { display: 'block', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', boxShadow: '0 12px 28px rgba(15,23,42,0.05)' },
  thumbWrap: { minHeight: '210px', padding: '24px', display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'center' },
  cardLead: { margin: '0 0 8px', fontSize: '12px', fontWeight: '800', color: C.primary },
  cardTitle: { margin: '0 0 10px', fontSize: '28px', lineHeight: 1.1, color: C.text, whiteSpace: 'pre-line' },
  cardSub: { margin: 0, fontSize: '14px', color: C.textSub, fontWeight: '700' },
  thumbCircle: { width: '96px', height: '96px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%', objectFit: 'cover' },
  body: { padding: '20px 22px 22px' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' },
  statusBadge: { display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '800' },
  statusBadgeLive: { background: '#FFF1F1', color: C.primary },
  statusBadgeSoon: { background: '#EFF6FF', color: '#2563EB' },
  statusBadgeDark: { background: '#18181B', color: '#F9FAFB' },
  audienceText: { fontSize: '12px', color: C.textLight, fontWeight: '700' },
  date: { margin: '0 0 10px', fontSize: '13px', color: C.textLight, fontWeight: '700' },
  bodyDesc: { margin: '0 0 18px', fontSize: '14px', lineHeight: 1.7, color: C.textSub },
  moreBtn: { display: 'inline-flex', padding: '10px 14px', borderRadius: '999px', background: '#FFF1F1', color: C.primary, fontSize: '13px', fontWeight: '800' },
  secondaryBtn: { display: 'inline-flex', padding: '11px 16px', borderRadius: '999px', border: `1px solid ${C.border}`, background: '#fff', color: C.text, textDecoration: 'none', fontSize: '14px', fontWeight: '700' },
};
