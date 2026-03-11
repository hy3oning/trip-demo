import { C } from '../../styles/tokens';

export default function ListPageHeader({ title, description, actions }) {
  return (
    <div style={s.header}>
      <div style={s.textWrap}>
        <h2 style={s.title}>{title}</h2>
        {description ? <p style={s.description}>{description}</p> : null}
      </div>
      {actions ? <div style={s.actions}>{actions}</div> : null}
    </div>
  );
}

const s = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '14px',
    marginBottom: '24px',
  },
  textWrap: { display: 'flex', flexDirection: 'column', gap: '6px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '800', color: C.text },
  description: { margin: 0, fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  actions: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
};
