export default function FilterChips({ items, value, onChange }) {
  return (
    <div style={s.group}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            style={{
              ...s.button,
              ...(active ? s.buttonActive : null),
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

const s = {
  group: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '7px 14px',
    borderRadius: '999px',
    border: '1px solid #E5E7EB',
    background: '#fff',
    color: '#4B5563',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  buttonActive: {
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    borderColor: '#E8484A',
    color: '#fff',
  },
};
