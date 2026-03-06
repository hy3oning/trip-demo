import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { ROLES } from '../../constants/roles';
import { C, MAX_WIDTH } from '../../styles/tokens';
import LogoMark from './LogoMark';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const baseLinks = [
    { to: '/lodgings', label: '숙소 검색', primary: true },
    { to: '/lodgings?region=제주', label: '인기 지역' },
    { to: '/inquiry/create', label: '문의 센터' },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/');
  };

  const initial = user?.name?.[0] || '?';

  const roleLinks = {
    [ROLES.USER]: [
      { to: '/my/bookings', label: '내 예약' },
      { to: '/mypage', label: '마이페이지' },
    ],
    [ROLES.SELLER]: [
      { to: '/seller/lodgings', label: '내 숙소' },
      { to: '/mypage', label: '마이페이지' },
    ],
    [ROLES.ADMIN]: [
      { to: '/admin', label: '관리자' },
    ],
  };

  return (
    <header style={s.header}>
      <style>{`
        .tz-header-nav::-webkit-scrollbar { display: none; }
        @media (max-width: 1280px) {
          .tz-header-inner { grid-template-columns: auto 1fr auto !important; }
          .tz-header-nav a { padding: 6px 10px !important; font-size: 12px !important; }
          .tz-header-actions a { padding: 7px 12px !important; font-size: 12px !important; }
        }
        @media (max-width: 980px) {
          .tz-header-nav { overflow-x: auto !important; }
          .tz-header-actions { min-width: auto !important; }
          .tz-header-inner { height: 68px !important; }
        }
        @media (max-width: 840px) {
          .tz-header-inner {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            height: 68px !important;
          }
          .tz-header-nav,
          .tz-header-actions {
            display: none !important;
          }
          .tz-header-mobile-toggle {
            display: inline-flex !important;
          }
          .tz-header-mobile-panel {
            display: block !important;
          }
        }
      `}</style>
      <div style={s.inner} className="tz-header-inner">
        <Link to="/" style={s.logo} className="tz-header-logo">
          <LogoMark compact />
        </Link>

        <nav style={s.nav} className="tz-header-nav">
          {baseLinks.map((link) => (
            <Link key={link.to} to={link.to} style={link.primary ? s.navSearchLink : s.navLink}>{link.label}</Link>
          ))}
        </nav>

        <div style={s.actions} className="tz-header-actions">
          {!user ? (
            <>
              <Link to="/login" style={s.loginBtn}>로그인</Link>
              <Link to="/signup" style={s.signupBtn}>회원가입</Link>
            </>
          ) : (
            <div style={s.profileWrap}>
              {(roleLinks[user.role] || []).map(l => (
                <Link key={l.to} to={l.to} style={s.navLink}>{l.label}</Link>
              ))}
              <div style={s.avatarWrap} onClick={() => setMenuOpen(v => !v)}>
                <div style={s.avatar}>{initial}</div>
              </div>
              {menuOpen && (
                <div style={s.dropdown}>
                  <div style={s.dropdownUser}>
                    <strong style={{ fontSize: '14px', fontWeight: '600', color: C.text }}>{user.name}</strong>
                    <span style={{ fontSize: '12px', color: C.textSub, marginTop: '2px' }}>{user.email}</span>
                  </div>
                  <div style={s.hr} />
                  <button onClick={handleLogout} style={s.logoutBtn}>로그아웃</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          style={s.mobileToggle}
          className="tz-header-mobile-toggle"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>
      </div>

      {mobileNavOpen && (
        <div style={s.mobilePanel} className="tz-header-mobile-panel">
          <div style={s.mobileLinks}>
            {baseLinks.map((link) => (
              <Link key={link.to} to={link.to} style={link.primary ? s.mobilePrimaryLink : s.mobileLink} onClick={() => setMobileNavOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user && (roleLinks[user.role] || []).map((link) => (
              <Link key={link.to} to={link.to} style={s.mobileLink} onClick={() => setMobileNavOpen(false)}>{link.label}</Link>
            ))}
          </div>
          <div style={s.mobileActions}>
            {!user ? (
              <>
                <Link to="/login" style={s.mobileGhostBtn} onClick={() => setMobileNavOpen(false)}>로그인</Link>
                <Link to="/signup" style={s.mobilePrimaryBtn} onClick={() => setMobileNavOpen(false)}>회원가입</Link>
              </>
            ) : (
              <button style={s.mobileGhostBtn} onClick={handleLogout}>로그아웃</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const s = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.96)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid #F0E8E8`,
    fontFamily: 'Manrope, "Noto Sans KR", sans-serif',
  },
  inner: {
    maxWidth: 'min(1580px, calc(100vw - 40px))',
    margin: '0 auto',
    padding: '0 12px',
    height: '74px',
    display: 'grid',
    gridTemplateColumns: '220px 1fr 220px',
    alignItems: 'center',
    columnGap: '10px',
  },
  logo: { textDecoration: 'none', minWidth: '220px' },
  nav: { display: 'flex', gap: '6px', flexWrap: 'nowrap', justifyContent: 'center', flex: 1, minWidth: 0, overflowX: 'hidden', scrollbarWidth: 'none' },
  navLink: {
    fontSize: '13px',
    fontWeight: '600',
    color: C.textSub,
    textDecoration: 'none',
    padding: '7px 12px',
    borderRadius: '6px',
    transition: 'color 0.15s, background 0.15s',
    whiteSpace: 'nowrap',
  },
  navSearchLink: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#FFFFFF',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    boxShadow: '0 8px 18px rgba(232,72,74,0.25)',
    whiteSpace: 'nowrap',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', justifyContent: 'flex-end', flexWrap: 'nowrap' },
  mobileToggle: {
    display: 'none',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: '1px solid #E4E4E4',
    background: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#444',
    cursor: 'pointer',
  },
  loginBtn: {
    fontSize: '13px',
    fontWeight: '600',
    color: C.textSub,
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    border: `1px solid ${C.border}`,
    background: '#fff',
  },
  signupBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
  },
  profileWrap: { display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' },
  avatarWrap: { cursor: 'pointer', marginLeft: '6px' },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  dropdown: {
    position: 'absolute',
    top: '44px',
    right: 0,
    background: '#fff',
    border: `1px solid #E2E2E0`,
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    padding: '6px 0',
    minWidth: '180px',
    zIndex: 200,
  },
  dropdownUser: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 16px 10px',
  },
  hr: { height: '1px', background: '#EEEEEC', margin: '4px 0' },
  logoutBtn: {
    width: '100%',
    textAlign: 'left',
    padding: '9px 16px',
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: C.textSub,
    cursor: 'pointer',
  },
  mobilePanel: {
    display: 'none',
    borderTop: '1px solid #F0E8E8',
    background: '#fff',
    padding: '14px 16px 16px',
  },
  mobileLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileLink: {
    textDecoration: 'none',
    color: '#3E3E3E',
    fontWeight: 600,
    fontSize: '14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: '#F8F8F8',
  },
  mobilePrimaryLink: {
    textDecoration: 'none',
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    padding: '10px 12px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
  },
  mobileActions: { display: 'flex', gap: '8px', marginTop: '12px' },
  mobileGhostBtn: {
    flex: 1,
    textAlign: 'center',
    textDecoration: 'none',
    border: '1px solid #E3E3E3',
    background: '#fff',
    color: '#4B4B4B',
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  mobilePrimaryBtn: {
    flex: 1,
    textAlign: 'center',
    textDecoration: 'none',
    border: 'none',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    color: '#fff',
    borderRadius: '999px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 700,
  },
};
