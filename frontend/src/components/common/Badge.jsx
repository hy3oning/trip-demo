import { C } from '../../styles/tokens';

const VARIANTS = {
  confirmed: { bg: C.successBg, color: C.success },
  cancelled: { bg: C.warningBg, color: C.warning },
  pending:   { bg: C.pendingBg, color: C.pending },
  answered:  { bg: C.successBg, color: C.success },
  approved:  { bg: C.successBg, color: C.success },
  rejected:  { bg: C.warningBg, color: C.warning },
};

const STATUS_MAP = {
  CONFIRMED:  'confirmed',
  CANCELLED:  'cancelled',
  PENDING:    'pending',
  ANSWERED:   'answered',
  APPROVED:   'approved',
  REJECTED:   'rejected',
};

const LABELS = {
  CONFIRMED: '예약 확정',
  CANCELLED: '취소됨',
  PENDING:   '대기 중',
  ANSWERED:  '답변 완료',
  APPROVED:  '승인',
  REJECTED:  '거절',
};

export default function Badge({ status, label }) {
  const variant = VARIANTS[STATUS_MAP[status]] || VARIANTS.pending;
  return (
    <span style={{ ...s.badge, background: variant.bg, color: variant.color }}>
      {label || LABELS[status] || status}
    </span>
  );
}

const s = {
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
};
