export function buildCouponDestination(coupon) {
  const scope = coupon?.applyScope || 'all';
  const couponId = coupon?.couponNo || '';

  if (scope === 'overseas') {
    return `/overseas?benefit=coupon&couponId=${couponId}&scope=overseas`;
  }

  if (scope === 'domestic') {
    return `/lodgings?benefit=coupon&couponId=${couponId}&scope=domestic`;
  }

  return `/lodgings?benefit=coupon&couponId=${couponId}&scope=all`;
}

export function buildPointsDestination() {
  return '/lodgings?benefit=points&scope=applicable';
}

export function getBenefitScopeLabel(scope) {
  if (scope === 'domestic') return '쿠폰 적용 가능한 국내 숙소';
  if (scope === 'overseas') return '쿠폰 적용 가능한 해외 숙소';
  if (scope === 'applicable') return '포인트 사용 가능한 숙소';
  return '혜택 적용 가능한 숙소';
}
