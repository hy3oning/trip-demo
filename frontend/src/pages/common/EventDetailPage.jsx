import { Link, useParams } from 'react-router-dom';
import { EVENT_ITEMS, findEventBySlug } from '../../mock/eventData';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function EventDetailPage() {
  const { eventSlug } = useParams();
  const event = findEventBySlug(eventSlug);
  // TODO(back-end): 이벤트 상세 API가 준비되면 slug 기반 상세 조회 응답으로 교체한다.
  const eventActionLink = eventSlug === 'attendance-point-festa' ? '/attendance' : '/lodgings';

  if (!event) {
    return (
      <div style={s.page}>
        <div style={s.inner}>
          <div style={s.emptyCard}>
            <p style={s.emptyEyebrow}>EVENT DETAIL</p>
            <h1 style={s.emptyTitle}>이벤트를 찾을 수 없습니다.</h1>
            <p style={s.emptyDesc}>존재하지 않거나 종료된 이벤트일 수 있습니다. 다른 이벤트를 확인해 주세요.</p>
            <Link to="/events" style={s.primaryBtn}>이벤트 목록 보기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <section style={{ ...s.hero, background: event.gradient }}>
        <div style={s.inner}>
          <div style={s.heroTop}>
            <div>
              <div style={s.heroBadgeRow}>
                <span style={{ ...s.statusBadge, ...(event.status === '등급전용' ? s.statusBadgeDark : event.status === '오픈예정' ? s.statusBadgeSoon : s.statusBadgeLive) }}>
                  {event.status}
                </span>
                <span style={s.audienceBadge}>{event.audienceLabel}</span>
              </div>
              <p style={s.eyebrow}>{event.lead}</p>
              <h1 style={s.title}>{event.title}</h1>
              <p style={s.subtitle}>{event.subtitle}</p>
              <p style={s.date}>{event.date}</p>
            </div>
            <div style={{ ...s.heroCircle, background: event.circle }}>
              <img src={event.imageUrl} alt={event.subtitle} style={s.heroImage} />
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.inner}>
          <div style={s.infoCard}>
            <p style={s.infoEyebrow}>EVENT STORY</p>
            <p style={s.infoDesc}>{event.description}</p>
            <div style={s.actions}>
              <Link to="/events" style={s.secondaryBtn}>이벤트 목록</Link>
              <Link to="/benefits" style={s.secondaryBtn}>혜택 보기</Link>
              <Link to={eventActionLink} style={s.primaryBtn}>{event.ctaLabel}</Link>
            </div>
          </div>

          <div style={s.summaryGrid}>
            <article style={s.summaryCard}>
              <p style={s.summaryLabel}>참여 대상</p>
              <p style={s.summaryValue}>{event.audienceLabel}</p>
              <p style={s.summaryDesc}>로그인 상태, 등급 조건, 참여 횟수 제한 같은 정책을 백엔드 응답으로 확장할 수 있습니다.</p>
            </article>
            <article style={s.summaryCard}>
              <p style={s.summaryLabel}>참여 방식</p>
              <p style={s.summaryValue}>{event.ctaLabel}</p>
              <p style={s.summaryDesc}>실제 참여 엔드포인트가 준비되면 버튼 목적지를 해당 기능 화면으로 교체하면 됩니다.</p>
            </article>
          </div>

          <div style={s.grid}>
            {event.highlights.map((item) => (
              <article key={item.title} style={s.highlightCard}>
                <h2 style={s.highlightTitle}>{item.title}</h2>
                <p style={s.highlightDesc}>{item.desc}</p>
              </article>
            ))}
          </div>

          <div style={s.moreSection}>
            <div style={s.moreHead}>
              <h2 style={s.moreTitle}>다른 이벤트</h2>
            </div>
            <div style={s.moreGrid}>
              {EVENT_ITEMS.filter((item) => item.slug !== event.slug).slice(0, 3).map((item) => (
                <Link key={item.slug} to={`/events/${item.slug}`} style={s.moreCard}>
                  <p style={s.moreLead}>{item.lead}</p>
                  <h3 style={s.moreCardTitle}>{item.title}</h3>
                  <p style={s.moreDate}>{item.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  hero: { padding: '64px 24px 44px', borderBottom: '1px solid #F0E8E8' },
  heroTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  heroBadgeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '7px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: '800' },
  statusBadgeLive: { background: '#FFF1F1', color: C.primary },
  statusBadgeSoon: { background: '#EFF6FF', color: '#2563EB' },
  statusBadgeDark: { background: '#18181B', color: '#F9FAFB' },
  audienceBadge: { display: 'inline-flex', alignItems: 'center', padding: '7px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: '800', background: '#fff', color: C.text, border: `1px solid ${C.borderLight}` },
  eyebrow: { margin: '0 0 12px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.12em', color: C.primary },
  title: { margin: '0 0 12px', fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 1.08, whiteSpace: 'pre-line', color: C.text },
  subtitle: { margin: '0 0 10px', fontSize: '16px', color: C.textSub, fontWeight: '700' },
  date: { margin: 0, fontSize: '14px', color: C.textLight },
  heroCircle: { width: '180px', height: '180px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  section: { padding: '36px 24px 64px' },
  infoCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '24px', marginBottom: '22px' },
  infoEyebrow: { margin: '0 0 10px', fontSize: '12px', color: C.textLight, fontWeight: '800' },
  infoDesc: { margin: 0, fontSize: '15px', color: C.textSub, lineHeight: 1.8, maxWidth: '840px' },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '22px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' },
  summaryCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '22px' },
  summaryLabel: { margin: '0 0 8px', fontSize: '12px', color: C.textLight, fontWeight: '800' },
  summaryValue: { margin: '0 0 10px', fontSize: '22px', color: C.text, fontWeight: '800' },
  summaryDesc: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
  primaryBtn: { padding: '12px 18px', borderRadius: '999px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '14px' },
  secondaryBtn: { padding: '12px 18px', borderRadius: '999px', background: '#fff', color: C.text, textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: `1px solid ${C.border}` },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  highlightCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '22px', boxShadow: '0 10px 24px rgba(15,23,42,0.05)' },
  highlightTitle: { margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: C.text },
  highlightDesc: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: C.textSub },
  moreSection: { marginTop: '28px' },
  moreHead: { marginBottom: '14px' },
  moreTitle: { margin: 0, fontSize: '24px', fontWeight: '800', color: C.text },
  moreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' },
  moreCard: { display: 'block', background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '18px', padding: '18px', textDecoration: 'none' },
  moreLead: { margin: '0 0 8px', fontSize: '12px', fontWeight: '800', color: C.primary },
  moreCardTitle: { margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: C.text, whiteSpace: 'pre-line' },
  moreDate: { margin: 0, fontSize: '13px', color: C.textLight },
  emptyCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '52px 28px', textAlign: 'center', marginTop: '48px' },
  emptyEyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', color: C.primary },
  emptyTitle: { margin: '0 0 10px', fontSize: '32px', fontWeight: '800', color: C.text },
  emptyDesc: { margin: '0 0 20px', fontSize: '15px', color: C.textSub, lineHeight: 1.7 },
};
