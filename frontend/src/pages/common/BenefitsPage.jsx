import { Link } from 'react-router-dom';
import { benefitSnapshot, couponItems, gradeGuide, mileageItems } from '../../mock/benefitsData';
import { C, MAX_WIDTH, R, S } from '../../styles/tokens';
import { buildCouponDestination, buildPointsDestination } from '../../utils/benefitNavigation';

function formatWon(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function GradeCard({ item, active }) {
  return (
    <article style={{
      ...s.gradeCard,
      background: item.bg,
      color: item.textColor || C.text,
      boxShadow: active ? `0 0 0 1px rgba(17,24,39,0.06), 0 16px 36px rgba(17,24,39,0.14)` : 'none',
      transform: active ? 'translateY(-2px)' : 'none',
    }}>
      <div style={s.gradeRow}>
        <span style={{ ...s.gradeBadge, color: item.accent }}>{item.name}</span>
        <span style={{ ...s.gradeRate, color: item.accent }}>{item.mileageRate}% 적립</span>
      </div>
      {active && <span style={s.activePill}>현재 등급</span>}
      <p style={{ ...s.gradeCond, color: item.textColor || C.text }}>누적 결제 {formatWon(item.minTotalAmount)} 또는 {item.minStayCount}회 숙박</p>
      <p style={{ ...s.gradeBenefit, color: item.textColor === '#F9FAFB' ? 'rgba(249,250,251,0.84)' : C.textSub }}>{item.benefit}</p>
    </article>
  );
}

export default function BenefitsPage() {
  // TODO(back-end): /api/v1/me/benefits, /api/v1/me/coupons, /api/v1/me/mileage 응답으로 교체
  // TODO(back-end): 사용하러 가기 버튼은 나중에 국내/국외/적용 가능 숙소 필터 진입으로 교체한다.
  const activeGrade = gradeGuide.find((item) => item.name === benefitSnapshot.currentGrade) || gradeGuide[0];

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <section style={s.hero}>
          <div>
            <p style={s.eyebrow}>TripZone Membership</p>
            <h1 style={s.title}>{benefitSnapshot.currentGrade} 등급 혜택</h1>
            <p style={s.desc}>
              현재 보유 포인트, 사용 가능 쿠폰, 다음 등급까지 남은 조건을 한 번에 확인할 수 있습니다.
            </p>
          </div>
          <div style={s.heroCard}>
            <p style={s.heroLabel}>현재 요약</p>
            <div style={s.heroGrid}>
              <div id="points">
                <p style={s.heroValue}>{formatWon(benefitSnapshot.mileageBalance)}</p>
                <p style={s.heroMeta}>보유 포인트</p>
              </div>
              <div id="coupons">
                <p style={s.heroValue}>{benefitSnapshot.couponCount}장</p>
                <p style={s.heroMeta}>사용 가능 쿠폰</p>
              </div>
              <div>
                <p style={s.heroValue}>{benefitSnapshot.annualStayCount}회</p>
                <p style={s.heroMeta}>누적 숙박 횟수</p>
              </div>
              <div>
                <p style={s.heroValue}>{formatWon(benefitSnapshot.annualSpendAmount)}</p>
                <p style={s.heroMeta}>누적 결제 금액</p>
              </div>
            </div>
            <p style={s.heroFoot}>{benefitSnapshot.nextGradeRemainBookings}번 더 예약하면 {benefitSnapshot.nextGrade} 등급 예상</p>
          </div>
        </section>

        <section style={s.section}>
          <div style={s.sectionHead}>
            <div>
              <p style={s.sectionEyebrow}>등급 안내</p>
              <h2 style={s.sectionTitle}>회원 등급별 혜택</h2>
            </div>
            <Link to="/mypage" style={s.linkBtn}>마이페이지로 이동</Link>
          </div>
          <div style={s.gradeGrid}>
            {gradeGuide.map((item) => (
              <GradeCard key={item.code} item={item} active={item.code === activeGrade.code} />
            ))}
          </div>
        </section>

        <section style={s.split}>
          <article style={s.panel}>
            <div style={s.sectionHeadCompact}>
              <div>
                <p style={s.sectionEyebrow}>쿠폰</p>
                <h2 style={s.sectionTitle}>최근 쿠폰</h2>
              </div>
              <Link to="/coupons" style={s.ctaBtn}>쿠폰함 보기</Link>
            </div>
            <div style={s.stack}>
              {couponItems.slice(0, 2).map((coupon) => (
                <div key={coupon.couponNo} style={s.couponCard}>
                  <div>
                    <p style={s.couponTitle}>{coupon.couponName}</p>
                    <p style={s.couponMeta}>{coupon.discountLabel} · {coupon.maxDiscountLabel}</p>
                  </div>
                  <div style={s.couponSide}>
                    <span style={s.couponStatus}>{coupon.status}</span>
                    <span style={s.couponExpire}>{coupon.expiredAt}까지</span>
                    <Link to={buildCouponDestination(coupon)} style={s.couponLink}>사용하러 가기</Link>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article style={s.panel}>
            <div style={s.sectionHeadCompact}>
              <div>
                <p style={s.sectionEyebrow}>포인트</p>
                <h2 style={s.sectionTitle}>최근 적립/사용</h2>
              </div>
              <Link to="/points" style={s.ctaBtn}>포인트함 보기</Link>
            </div>
            <div style={s.stack}>
              {mileageItems.map((item) => (
                <div key={item.mileageHistoryNo} style={s.mileageRow}>
                  <div>
                    <p style={s.mileageReason}>{item.reason}</p>
                    <p style={s.mileageDate}>{item.regDate}</p>
                  </div>
                  <div style={s.mileageSide}>
                    <div style={{ ...s.mileageAmount, color: item.changeAmount > 0 ? C.success : C.text }}>
                      {item.changeAmount > 0 ? '+' : ''}{item.changeAmount.toLocaleString()}P
                    </div>
                    <Link to={buildPointsDestination()} style={s.mileageLink}>사용하러 가기</Link>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: 'linear-gradient(180deg, #F8F5F2 0%, #FFFFFF 18%)', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 72px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  hero: { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'stretch' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.18em', color: C.textLight, fontWeight: 700 },
  title: { margin: 0, fontSize: '40px', lineHeight: 1.1, color: C.text },
  desc: { margin: '16px 0 0', fontSize: '16px', lineHeight: 1.7, color: C.textSub, maxWidth: '600px' },
  heroCard: { borderRadius: '24px', padding: '24px', background: 'linear-gradient(135deg, #161616 0%, #383838 100%)', color: '#fff', boxShadow: S.card },
  heroLabel: { margin: 0, fontSize: '13px', opacity: 0.75 },
  heroGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '18px' },
  heroValue: { margin: 0, fontSize: '24px', fontWeight: 800 },
  heroMeta: { margin: '6px 0 0', fontSize: '12px', opacity: 0.75 },
  heroFoot: { margin: '18px 0 0', fontSize: '13px', color: '#FDE68A', fontWeight: 700 },
  section: { background: '#fff', borderRadius: '24px', padding: '28px', boxShadow: S.card, border: `1px solid ${C.borderLight}` },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '20px' },
  sectionHeadCompact: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', marginBottom: '16px' },
  sectionEyebrow: { margin: 0, fontSize: '12px', color: C.textLight, fontWeight: 700 },
  sectionTitle: { margin: '6px 0 0', fontSize: '24px', color: C.text },
  linkBtn: { padding: '10px 14px', borderRadius: R.pill, textDecoration: 'none', color: C.text, background: C.bgGray, fontWeight: 700, fontSize: '14px' },
  ctaBtn: {
    padding: '10px 14px',
    borderRadius: R.pill,
    textDecoration: 'none',
    color: '#fff',
    background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)',
    fontWeight: 800,
    fontSize: '13px',
  },
  gradeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  gradeCard: { border: `1px solid rgba(255,255,255,0.24)`, borderRadius: '20px', padding: '20px', minHeight: '180px', transition: 'transform .18s ease, box-shadow .18s ease' },
  gradeRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' },
  gradeBadge: { fontSize: '18px', fontWeight: 800 },
  gradeRate: { fontSize: '13px', fontWeight: 700 },
  activePill: { display: 'inline-block', marginBottom: '12px', padding: '5px 9px', borderRadius: R.pill, background: 'rgba(255,255,255,0.72)', color: '#111827', fontSize: '11px', fontWeight: 800 },
  gradeCond: { margin: '0 0 10px', fontSize: '14px', lineHeight: 1.6, color: C.text },
  gradeBenefit: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
  split: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  panel: { background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: S.card, border: `1px solid ${C.borderLight}` },
  stack: { display: 'flex', flexDirection: 'column', gap: '14px' },
  couponCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', border: `1px solid ${C.borderLight}`, borderRadius: '18px', padding: '16px' },
  couponTitle: { margin: 0, fontSize: '16px', fontWeight: 700, color: C.text },
  couponMeta: { margin: '6px 0 0', fontSize: '13px', color: C.textSub },
  couponSide: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  couponStatus: { fontSize: '11px', fontWeight: 800, color: C.success, background: C.successBg, padding: '6px 8px', borderRadius: R.pill },
  couponExpire: { fontSize: '12px', color: C.textLight },
  couponLink: { fontSize: '12px', color: C.primary, textDecoration: 'none', fontWeight: '800' },
  mileageRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', borderBottom: `1px solid ${C.borderLight}`, paddingBottom: '12px' },
  mileageSide: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  mileageReason: { margin: 0, fontSize: '15px', fontWeight: 700, color: C.text },
  mileageDate: { margin: '6px 0 0', fontSize: '12px', color: C.textLight },
  mileageAmount: { fontSize: '16px', fontWeight: 800 },
  mileageLink: { fontSize: '12px', color: C.primary, textDecoration: 'none', fontWeight: '800' },
};
