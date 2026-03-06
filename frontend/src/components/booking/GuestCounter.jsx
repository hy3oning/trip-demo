import { C, R } from '../../styles/tokens';

export default function GuestCounter({ value, onChange, min = 1, max = 10 }) {
  return (
    <div style={s.wrap}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{ ...s.btn, opacity: value <= min ? 0.3 : 1 }}
      >
        −
      </button>
      <span style={s.value}>{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{ ...s.btn, opacity: value >= max ? 0.3 : 1 }}
      >
        +
      </button>
    </div>
  );
}

const s = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  btn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: `1px solid ${C.border}`,
    background: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: C.text,
    transition: 'border-color 0.15s',
  },
  value: {
    fontSize: '16px',
    fontWeight: '500',
    minWidth: '24px',
    textAlign: 'center',
    color: C.text,
  },
};
