import { Link } from 'react-router-dom';
import { C } from '../../styles/tokens';

export default function DashboardStatCard({ label, value, link, description, background = '#fff' }) {
  return (
    <Link to={link} style={{ ...s.card, background }}>
      <div style={s.label}>{label}</div>
      <div style={s.value}>{value}</div>
      {description ? <div style={s.description}>{description}</div> : null}
    </Link>
  );
}

const s = {
  card: {
    display: 'block',
    padding: '24px',
    borderRadius: '18px',
    border: `1px solid ${C.borderLight}`,
    textDecoration: 'none',
    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
  },
  label: {
    margin: '0 0 10px',
    fontSize: '14px',
    fontWeight: '700',
    color: C.textSub,
  },
  value: {
    margin: '0 0 8px',
    fontSize: '34px',
    fontWeight: '800',
    color: C.text,
  },
  description: {
    fontSize: '13px',
    color: '#667085',
  },
};
