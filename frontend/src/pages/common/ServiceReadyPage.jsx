import { Link } from 'react-router-dom';
import { C, MAX_WIDTH } from '../../styles/tokens';

export default function ServiceReadyPage({
  eyebrow = 'TRIPZONE SERVICE',
  title,
  description,
  highlights = [],
  primaryAction,
  secondaryAction,
}) {
  // TODO(back-end): 서비스별 상품 목록/이벤트/카테고리 API가 준비되면 highlights와 CTA를 실제 응답 기준으로 교체한다.
  return (
    <div style={s.page}>
      <section style={s.hero}>
        <div style={s.heroInner}>
          <p style={s.eyebrow}>{eyebrow}</p>
          <h1 style={s.title}>{title}</h1>
          <p style={s.description}>{description}</p>
          <div style={s.actions}>
            {primaryAction ? <Link to={primaryAction.to} style={s.primaryBtn}>{primaryAction.label}</Link> : null}
            {secondaryAction ? <Link to={secondaryAction.to} style={s.secondaryBtn}>{secondaryAction.label}</Link> : null}
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.cardGrid}>
            {highlights.map((item) => (
              <article key={item.title} style={s.card}>
                <div style={s.iconWrap}>{item.icon}</div>
                <h2 style={s.cardTitle}>{item.title}</h2>
                <p style={s.cardDesc}>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)' },
  hero: {
    padding: '80px 24px 56px',
    background: 'linear-gradient(145deg, #FFF6F1 0%, #FFFFFF 52%, #F6F7FF 100%)',
    borderBottom: '1px solid #F0E8E8',
  },
  heroInner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  eyebrow: { margin: '0 0 14px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 14px', fontSize: 'clamp(32px, 4vw, 50px)', lineHeight: 1.06, letterSpacing: '-0.03em', color: C.text },
  description: { margin: 0, maxWidth: '760px', fontSize: '16px', lineHeight: 1.8, color: C.textSub },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' },
  primaryBtn: {
    padding: '13px 22px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '800',
    fontSize: '14px',
  },
  secondaryBtn: {
    padding: '13px 22px',
    borderRadius: '999px',
    background: '#fff',
    color: C.text,
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
    border: `1px solid ${C.border}`,
  },
  section: { padding: '38px 24px 64px' },
  sectionInner: { maxWidth: MAX_WIDTH, margin: '0 auto' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  card: {
    background: '#fff',
    border: `1px solid ${C.borderLight}`,
    borderRadius: '20px',
    padding: '22px',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
  },
  iconWrap: {
    width: '46px',
    height: '46px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFF2F2',
    fontSize: '22px',
    marginBottom: '14px',
  },
  cardTitle: { margin: '0 0 10px', fontSize: '18px', fontWeight: '800', color: C.text },
  cardDesc: { margin: 0, fontSize: '14px', lineHeight: 1.7, color: C.textSub },
};
