import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, R } from '../../styles/tokens';
import { ALL_REGIONS } from '../../mock/mockData';

export default function SearchBar({ defaultRegion = '', defaultCheckIn = '', defaultCheckOut = '', defaultGuests = 2 }) {
  const navigate = useNavigate();
  const [region, setRegion] = useState(defaultRegion);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(defaultGuests);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = new URLSearchParams({ region, checkIn, checkOut, guests }).toString();
    navigate(`/lodgings?${q}`);
  };

  return (
    <div style={s.shell}>
    <style>{`
      .tz-search {
        display: grid;
        grid-template-columns: 1.35fr 1.1fr 1.1fr 0.9fr auto;
        align-items: stretch;
        gap: 0;
      }
      .tz-search .tz-field {
        border-right: 1px solid #ECECEC;
      }
      .tz-search .tz-field:last-of-type {
        border-right: none;
      }
      @media (max-width: 860px) {
        .tz-search {
          grid-template-columns: 1fr 1fr;
        }
        .tz-search .tz-btn-wrap {
          grid-column: 1 / -1;
          padding: 6px;
        }
        .tz-search .tz-field {
          border-right: none;
          border-bottom: 1px solid #ECECEC;
        }
      }
      @media (max-width: 560px) {
        .tz-search {
          grid-template-columns: 1fr;
        }
        .tz-search .tz-field {
          border-bottom: 1px solid #ECECEC;
        }
      }
    `}</style>
    <form onSubmit={handleSearch} style={s.bar} className="tz-search">
      {/* 지역 */}
      <div style={s.field} className="tz-field">
        <span style={s.label}>지역</span>
        <select value={region} onChange={e => setRegion(e.target.value)} style={s.control}>
          <option value="">어디든 가요</option>
          {ALL_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* 체크인 */}
      <div style={s.field} className="tz-field">
        <span style={s.label}>체크인</span>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} style={s.controlDate} />
      </div>

      {/* 체크아웃 */}
      <div style={s.field} className="tz-field">
        <span style={s.label}>체크아웃</span>
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} style={s.controlDate} />
      </div>

      {/* 인원 */}
      <div style={{ ...s.field, paddingRight: '12px' }} className="tz-field">
        <span style={s.label}>인원</span>
        <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={s.control}>
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}명</option>)}
        </select>
      </div>

      <div className="tz-btn-wrap" style={s.btnWrap}>
        <button type="submit" style={s.btn}>검색</button>
      </div>
    </form>
    </div>
  );
}

const s = {
  shell: {
    width: '100%',
  },
  bar: {
    background: '#fff',
    borderRadius: '24px',
    border: `1px solid #E5E5E5`,
    boxShadow: '0 10px 28px rgba(0,0,0,0.10)',
    overflow: 'hidden',
    width: '100%',
  },
  field: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: 0,
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: C.text,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  control: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: C.textSub,
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    width: '100%',
  },
  controlDate: {
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: C.textSub,
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    width: '100%',
    minWidth: 0,
  },
  btnWrap: { display: 'flex', alignItems: 'center', padding: '8px' },
  btn: {
    background: C.primary,
    color: '#fff',
    border: 'none',
    borderRadius: R.pill,
    padding: '16px 34px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '16px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    letterSpacing: '0.01em',
  },
};
