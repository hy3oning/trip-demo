import { C } from '../../styles/tokens';

export default function DashboardSection({
  title,
  description,
  loading,
  error,
  empty,
  children,
}) {
  return (
    <section style={s.section}>
      <div style={s.header}>
        <h3 style={s.title}>{title}</h3>
        {description ? <p style={s.description}>{description}</p> : null}
      </div>
      {loading ? <div style={s.stateBox}>데이터를 불러오는 중입니다...</div> : null}
      {!loading && error ? <div style={{ ...s.stateBox, ...s.errorBox }}>{error}</div> : null}
      {!loading && !error && empty ? <div style={s.stateBox}>표시할 데이터가 없습니다.</div> : null}
      {!loading && !error && !empty ? children : null}
    </section>
  );
}

const s = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    margin: 0,
    fontSize: '22px',
    fontWeight: '800',
    color: C.text,
  },
  description: {
    margin: 0,
    fontSize: '14px',
    color: C.textSub,
  },
  stateBox: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    padding: '40px 24px',
    textAlign: 'center',
    background: '#fff',
    color: C.textSub,
    fontSize: '14px',
    fontWeight: '600',
  },
  errorBox: {
    background: '#FEF2F2',
    borderColor: '#FECACA',
    color: '#B91C1C',
  },
};
