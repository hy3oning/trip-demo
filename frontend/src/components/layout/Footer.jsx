import { C, MAX_WIDTH } from '../../styles/tokens';
import LogoMark from './LogoMark';

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.brandCol}>
          <LogoMark />
          <p style={s.brandDesc}>국내 숙소를 더 빠르고 믿을 수 있게 예약하는 여행 플랫폼입니다.</p>
        </div>

        <div style={s.linksCol}>
          <p style={s.colTitle}>여행</p>
          <a href="/lodgings" style={s.link}>숙소 검색</a>
          <a href="/lodgings?region=강원" style={s.link}>강원 숙소</a>
          <a href="/lodgings?region=제주" style={s.link}>제주 숙소</a>
        </div>

        <div style={s.linksCol}>
          <p style={s.colTitle}>파트너</p>
          <a href="/signup" style={s.link}>판매자 등록</a>
          <a href="/seller" style={s.link}>판매자 센터</a>
          <a href="/admin" style={s.link}>관리자 콘솔</a>
        </div>

        <div style={s.linksCol}>
          <p style={s.colTitle}>지원</p>
          <a href="/inquiry/create" style={s.link}>문의하기</a>
          <span style={s.info}>평일 09:00-18:00</span>
          <span style={s.info}>support@tripzone.kr</span>
        </div>
      </div>
      <div style={s.bottomBar}>© 2026 TripZone. All rights reserved.</div>
    </footer>
  );
}

const s = {
  footer: {
    borderTop: `1px solid ${C.borderLight}`,
    background: 'linear-gradient(180deg, #FAF7F5 0%, #F2EFEC 100%)',
    padding: '42px 24px 0',
    fontFamily: 'Manrope, "Noto Sans KR", sans-serif',
  },
  inner: {
    maxWidth: 'min(1580px, calc(100vw - 40px))',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    alignItems: 'start',
    flexWrap: 'wrap',
    gap: '24px',
  },
  brandCol: { display: 'flex', flexDirection: 'column', gap: '12px' },
  brandDesc: { margin: 0, color: C.textSub, fontSize: '13px', lineHeight: 1.7, maxWidth: '320px' },
  linksCol: { display: 'flex', flexDirection: 'column', gap: '8px' },
  colTitle: { margin: 0, fontSize: '13px', fontWeight: 700, color: C.text, letterSpacing: '0.04em', textTransform: 'uppercase' },
  link: { fontSize: '13px', color: C.textSub, textDecoration: 'none' },
  info: { fontSize: '12px', color: '#747474' },
  bottomBar: {
    marginTop: '28px',
    borderTop: `1px solid ${C.borderLight}`,
    textAlign: 'center',
    padding: '14px 24px',
    fontSize: '12px',
    color: '#7B7B7B',
  },
};
