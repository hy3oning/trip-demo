export default function StatusBadge({ label, background = '#F3F4F6', color = '#374151' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 'fit-content',
        fontSize: '12px',
        fontWeight: '700',
        padding: '4px 10px',
        borderRadius: '999px',
        background,
        color,
      }}
    >
      {label}
    </span>
  );
}
