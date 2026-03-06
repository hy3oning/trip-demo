export const INQUIRY_TYPES = {
  USER_TO_SELLER: 'USER_TO_SELLER',       // 사용자 → 판매자 (숙소 문의)
  SELLER_TO_ADMIN: 'SELLER_TO_ADMIN',     // 판매자 → 관리자 (운영 문의)
  COMMON_TO_ADMIN: 'COMMON_TO_ADMIN',     // 사용자·판매자 → 관리자 (시스템 문의)
};

export const INQUIRY_TYPE_LABELS = {
  [INQUIRY_TYPES.USER_TO_SELLER]: '숙소 문의',
  [INQUIRY_TYPES.SELLER_TO_ADMIN]: '운영 문의',
  [INQUIRY_TYPES.COMMON_TO_ADMIN]: '시스템 문의',
};
