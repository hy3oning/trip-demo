import { C } from '../../styles/tokens';
import EmptyState from './EmptyState';

export default function DataTable({ columns, rows, loading, error, emptyText = '표시할 데이터가 없습니다.', emptyDescription }) {
  if (loading) {
    return <div style={s.stateBox}>목록을 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div style={{ ...s.stateBox, ...s.errorBox }}>{error}</div>;
  }

  if (!rows.length) {
    return (
      <div style={s.emptyWrap}>
        <EmptyState icon="📭" title={emptyText} desc={emptyDescription} />
      </div>
    );
  }

  return (
    <div style={s.tableWrap}>
      <style>{`
        @media (max-width: 840px) {
          .tz-data-table thead {
            display: none;
          }
          .tz-data-table,
          .tz-data-table tbody,
          .tz-data-table tr,
          .tz-data-table td {
            display: block;
            width: 100%;
          }
          .tz-data-table tr {
            padding: 14px 16px;
            border-bottom: 1px solid ${C.borderLight};
          }
          .tz-data-table td {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 0;
            border: none;
            font-size: 13px;
          }
          .tz-data-table td::before {
            content: attr(data-label);
            flex-shrink: 0;
            color: #6B7280;
            font-size: 12px;
            font-weight: 700;
          }
        }
      `}</style>
      <table style={s.table} className="tz-data-table">
        <thead>
          <tr style={s.headRow}>
            {columns.map((column) => (
              <th key={column.key} style={{ ...s.th, width: column.width }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? row.key ?? index} style={s.tr}>
              {columns.map((column) => (
                <td key={column.key} style={s.td} data-label={column.label}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const s = {
  tableWrap: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    overflow: 'hidden',
    background: '#fff',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  headRow: { background: '#FAFAFA' },
  th: {
    padding: '13px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#6B7280',
    borderBottom: `1px solid ${C.borderLight}`,
    whiteSpace: 'nowrap',
  },
  tr: { borderBottom: `1px solid ${C.borderLight}` },
  td: {
    padding: '15px 16px',
    fontSize: '14px',
    color: C.text,
    verticalAlign: 'middle',
  },
  stateBox: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    padding: '56px 24px',
    textAlign: 'center',
    color: C.textSub,
    background: '#fff',
    fontSize: '14px',
    fontWeight: '600',
  },
  errorBox: {
    color: '#B91C1C',
    background: '#FEF2F2',
    borderColor: '#FECACA',
  },
  emptyWrap: {
    border: `1px solid ${C.borderLight}`,
    borderRadius: '18px',
    background: '#fff',
  },
};
