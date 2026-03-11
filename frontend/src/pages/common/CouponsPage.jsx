import { Link } from 'react-router-dom';
import { benefitSnapshot, couponItems } from '../../mock/benefitsData';
import { C, MAX_WIDTH } from '../../styles/tokens';
import { buildCouponDestination } from '../../utils/benefitNavigation';

function formatWon(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

export default function CouponsPage() {
  // TODO(back-end): /api/v1/me/coupons 응답으로 교체하고, 쿠폰별 적용 가능 카테고리/국내·해외 조건을 함께 연결한다.
  const availableCoupons = couponItems.filter((coupon) => coupon.status === 'ISSUED');
  const expiredCoupons = couponItems.filter((coupon) => coupon.status !== 'ISSUED');

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <section style={s.hero}>
          <div>
            <p style={s.eyebrow}>MY COUPON WALLET</p>
            <h1 style={s.title}>쿠폰함</h1>
            <p style={s.desc}>지금 쓸 수 있는 쿠폰과 만료 예정 쿠폰을 한 번에 보고, 바로 사용할 수 있도록 정리했습니다.</p>
          </div>
          <Link to="/benefits" style={s.heroBtn}>혜택 페이지로 이동</Link>
        </section>

        <section style={s.summaryGrid}>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>사용 가능 쿠폰</p>
            <p style={s.summaryValue}>{availableCoupons.length}장</p>
            <p style={s.summaryDesc}>현재 보유 쿠폰 수는 헤더/혜택 페이지와 같은 mock 기준입니다.</p>
          </article>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>최대 할인 혜택</p>
            <p style={s.summaryValue}>{formatWon(Math.max(...availableCoupons.map((coupon) => coupon.maxDiscountAmount || 0), 0))}</p>
            <p style={s.summaryDesc}>가장 큰 할인 쿠폰 기준으로 숙소 탐색을 바로 시작할 수 있습니다.</p>
          </article>
          <article style={s.summaryCard}>
            <p style={s.summaryLabel}>현재 등급</p>
            <p style={s.summaryValue}>{benefitSnapshot.currentGrade}</p>
            <p style={s.summaryDesc}>등급별 쿠폰팩은 나중에 백엔드 응답으로 분리할 수 있게 열어뒀습니다.</p>
          </article>
        </section>

        <section style={s.section}>
          <div style={s.sectionHead}>
            <div>
              <p style={s.sectionEyebrow}>AVAILABLE</p>
              <h2 style={s.sectionTitle}>지금 사용할 수 있는 쿠폰</h2>
            </div>
            <Link to="/lodgings" style={s.sectionAction}>숙소 보러 가기</Link>
          </div>

          <div style={s.list}>
            {availableCoupons.map((coupon) => (
              <article key={coupon.couponNo} style={s.couponCard}>
                <div style={s.couponMain}>
                  <div style={s.couponTop}>
                    <span style={s.channelBadge}>{coupon.channel}</span>
                    <span style={s.statusBadge}>{coupon.status}</span>
                  </div>
                  <h3 style={s.couponTitle}>{coupon.couponName}</h3>
                  <p style={s.couponDesc}>{coupon.discountLabel} · {coupon.maxDiscountLabel} · {formatWon(coupon.minOrderAmount)} 이상</p>
                  <p style={s.couponApply}>{coupon.applyLabel}</p>
                  <p style={s.couponExpire}>사용 기한: {coupon.expiredAt}까지</p>
                </div>
                <div style={s.couponSide}>
                  <div style={s.couponMetaBox}>
                    <span style={s.metaLabel}>혜택 유형</span>
                    <strong style={s.metaValue}>{coupon.discountType === 'PERCENT' ? '비율 할인' : '정액 할인'}</strong>
                  </div>
                  <Link to={buildCouponDestination(coupon)} style={s.primaryBtn}>사용하러 가기</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {expiredCoupons.length ? (
          <section style={s.sectionMuted}>
            <div style={s.sectionHead}>
              <div>
                <p style={s.sectionEyebrow}>ARCHIVE</p>
                <h2 style={s.sectionTitle}>만료된 쿠폰</h2>
              </div>
            </div>

            <div style={s.list}>
              {expiredCoupons.map((coupon) => (
                <article key={coupon.couponNo} style={s.expiredCard}>
                  <div>
                    <p style={s.expiredTitle}>{coupon.couponName}</p>
                    <p style={s.expiredDesc}>{coupon.discountLabel} · {coupon.maxDiscountLabel}</p>
                  </div>
                  <div style={s.expiredSide}>
                    <span style={s.expiredBadge}>만료</span>
                    <span style={s.expiredDate}>{coupon.expiredAt}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

const s = {
  page: { background: '#F9F7F5', minHeight: 'calc(100vh - 160px)', padding: '48px 24px 72px' },
  inner: { maxWidth: MAX_WIDTH, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' },
  eyebrow: { margin: '0 0 10px', fontSize: '12px', fontWeight: '800', letterSpacing: '0.14em', color: C.primary },
  title: { margin: '0 0 10px', fontSize: '36px', fontWeight: '800', color: C.text },
  desc: { margin: 0, maxWidth: '720px', fontSize: '15px', lineHeight: 1.7, color: C.textSub },
  heroBtn: { display: 'inline-flex', alignItems: 'center', padding: '12px 18px', borderRadius: '999px', textDecoration: 'none', border: `1px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: '700' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  summaryCard: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '20px 22px', boxShadow: '0 10px 24px rgba(15,23,42,0.04)' },
  summaryLabel: { margin: 0, fontSize: '13px', color: C.textSub, fontWeight: '700' },
  summaryValue: { margin: '10px 0 8px', fontSize: '28px', color: C.text, fontWeight: '800' },
  summaryDesc: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
  section: { background: '#fff', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '24px', boxShadow: '0 12px 28px rgba(15,23,42,0.04)' },
  sectionMuted: { background: '#FCFCFC', border: `1px solid ${C.borderLight}`, borderRadius: '24px', padding: '24px' },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' },
  sectionEyebrow: { margin: 0, fontSize: '12px', color: C.textLight, fontWeight: '800' },
  sectionTitle: { margin: '6px 0 0', fontSize: '24px', color: C.text, fontWeight: '800' },
  sectionAction: { display: 'inline-flex', padding: '10px 14px', borderRadius: '999px', textDecoration: 'none', color: '#fff', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', fontWeight: '800', fontSize: '13px' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px' },
  couponCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '18px', border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '20px', background: '#fff' },
  couponMain: { flex: 1, minWidth: 0 },
  couponTop: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' },
  channelBadge: { display: 'inline-flex', padding: '6px 9px', borderRadius: '999px', background: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: '800' },
  statusBadge: { display: 'inline-flex', padding: '6px 9px', borderRadius: '999px', background: C.successBg, color: C.success, fontSize: '11px', fontWeight: '800' },
  couponTitle: { margin: '0 0 8px', fontSize: '20px', color: C.text, fontWeight: '800' },
  couponDesc: { margin: '0 0 8px', fontSize: '14px', lineHeight: 1.7, color: C.textSub },
  couponApply: { margin: '0 0 8px', fontSize: '12px', lineHeight: 1.6, color: C.primary, fontWeight: '800' },
  couponExpire: { margin: 0, fontSize: '12px', color: C.textLight, fontWeight: '700' },
  couponSide: { minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' },
  couponMetaBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  metaLabel: { fontSize: '11px', color: C.textLight, fontWeight: '700' },
  metaValue: { fontSize: '14px', color: C.text, fontWeight: '800' },
  primaryBtn: { display: 'inline-flex', justifyContent: 'center', alignItems: 'center', minWidth: '128px', padding: '12px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', textDecoration: 'none', fontWeight: '800', fontSize: '13px' },
  expiredCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', border: `1px solid ${C.borderLight}`, borderRadius: '18px', padding: '18px 20px', background: '#F8F8F8' },
  expiredTitle: { margin: '0 0 6px', fontSize: '16px', color: '#666', fontWeight: '700' },
  expiredDesc: { margin: 0, fontSize: '13px', color: '#8A8A8A' },
  expiredSide: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  expiredBadge: { display: 'inline-flex', padding: '6px 8px', borderRadius: '999px', background: '#ECECEC', color: '#777', fontSize: '11px', fontWeight: '800' },
  expiredDate: { fontSize: '12px', color: '#8A8A8A' },
};
