import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GuestCounter from '../../components/booking/GuestCounter';
import { getLodging } from '../../api/lodging';
import { createBooking } from '../../api/booking';
import { benefitSnapshot, couponItems, gradeGuide } from '../../mock/benefitsData';
import { C, MAX_WIDTH, R, S } from '../../styles/tokens';

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [inY, inM, inD] = String(checkIn).split('-').map(Number);
  const [outY, outM, outD] = String(checkOut).split('-').map(Number);
  if (!inY || !inM || !inD || !outY || !outM || !outD) return 0;
  const inUtc = Date.UTC(inY, inM - 1, inD);
  const outUtc = Date.UTC(outY, outM - 1, outD);
  return Math.max(0, Math.floor((outUtc - inUtc) / 86400000));
}

function getTodayText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BookingPage() {
  const { lodgingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state: navState } = useLocation();
  const [lodging, setLodging] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [checkIn, setCheckIn] = useState(navState?.checkIn || '');
  const [checkOut, setCheckOut] = useState(navState?.checkOut || '');
  const [guests, setGuests] = useState(navState?.guests || 2);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedCouponNo, setSelectedCouponNo] = useState('');
  const [useMileage, setUseMileage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setLoadError('');
    getLodging(lodgingId)
      .then((res) => {
        setLodging(res.data);
      })
      .catch(() => {
        setLodging(null);
        setLoadError('숙소 정보를 불러오지 못했습니다. 다시 시도해 주세요.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lodgingId]);

  const nights = calcNights(checkIn, checkOut);
  const basePrice = nights * (lodging?.pricePerNight || 0);
  const selectedCoupon = couponItems.find((item) => String(item.couponNo) === String(selectedCouponNo) && item.status === 'ISSUED');
  const couponDiscount = !selectedCoupon || basePrice < selectedCoupon.minOrderAmount
    ? 0
    : selectedCoupon.discountType === 'PERCENT'
      ? Math.min(Math.floor(basePrice * (selectedCoupon.discountValue / 100)), selectedCoupon.maxDiscountAmount || Number.MAX_SAFE_INTEGER)
      : selectedCoupon.discountValue;
  const mileageCap = Math.max(0, basePrice - couponDiscount);
  const appliedMileage = Math.max(0, Math.min(Number(useMileage || 0), benefitSnapshot.mileageBalance, mileageCap));
  const totalPrice = Math.max(0, basePrice - couponDiscount - appliedMileage);
  const expectedMileage = Math.floor(totalPrice * ((gradeGuide.find((item) => item.name === benefitSnapshot.currentGrade)?.mileageRate || 0) / 100));
  const canSubmit = checkIn && checkOut && nights > 0 && guestName.trim() && guestPhone.trim() && lodging;
  const today = getTodayText();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      if (!checkIn || !checkOut) {
        setFormError('체크인/체크아웃 날짜를 선택해 주세요.');
      } else if (nights <= 0) {
        setFormError('체크아웃은 체크인보다 이후 날짜여야 합니다.');
      } else if (!guestName.trim()) {
        setFormError('예약자 이름을 입력해 주세요.');
      } else if (!guestPhone.trim()) {
        setFormError('예약자 연락처를 입력해 주세요.');
      } else {
        setFormError('입력값을 다시 확인해 주세요.');
      }
      return;
    }
    setFormError('');
    // TODO(back-end): 예약 생성 API가 쿠폰/포인트를 받으면 아래 필드를 서버 계산 기준으로 맞춘다.
    await createBooking({
      lodgingId: Number(lodgingId),
      lodgingName: lodging.name,
      thumbnailUrl: lodging.thumbnailUrl,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      appliedCouponNo: selectedCoupon?.couponNo || null,
      usedMileage: appliedMileage,
      bookingStatus: 'CONFIRMED',
      userId: user?.userId || 1,
    });
    navigate('/booking/complete', {
      state: {
        lodgingName: lodging.name,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        couponName: selectedCoupon?.couponName || '',
        usedMileage: appliedMileage,
        couponDiscount,
        expectedMileage,
      },
    });
  };

  if (isLoading) return (
    <div style={{ padding: '80px', textAlign: 'center', color: C.textSub }}>로딩 중...</div>
  );

  if (loadError) {
    return (
      <div style={s.wrap} className="tz-booking-wrap">
        <div style={s.errorCard}>
          <h1 style={s.errorTitle}>예약 정보를 불러오지 못했습니다.</h1>
          <p style={s.errorText}>{loadError}</p>
          <div style={s.errorActions}>
            <Link to="/lodgings" style={s.backToListBtn}>숙소 목록 보기</Link>
            <button type="button" style={s.retryBtn} onClick={() => navigate(`/booking/${lodgingId}`, { replace: true })}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap} className="tz-booking-wrap">
      <style>{`
        @media (max-width: 980px) {
          .tz-booking-layout {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .tz-booking-summary {
            width: 100% !important;
            max-width: none !important;
          }
          .tz-booking-summary-card {
            position: static !important;
          }
          .tz-booking-wrap {
            padding: 24px 16px 44px !important;
          }
        }
        .tz-booking-submit-btn {
          transition: transform .14s ease, box-shadow .14s ease, filter .14s ease;
        }
        .tz-booking-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(232,72,74,0.32);
          filter: saturate(1.04);
        }
      `}</style>
      <Link to={`/lodgings/${lodgingId}`} style={s.back}>← 숙소로 돌아가기</Link>
      <h1 style={s.title}>예약하기</h1>

      <div style={s.layout} className="tz-booking-layout">
        {/* ── 좌측 폼 ── */}
        <form onSubmit={handleSubmit} style={s.form}>
          {/* 여행 일정 */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>여행 일정</h2>
            <div style={s.dateCard}>
              <div style={s.dateField}>
                <label style={s.fieldLabel}>체크인</label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => {
                    const nextCheckIn = e.target.value;
                    setCheckIn(nextCheckIn);
                    if (checkOut && nextCheckIn && checkOut <= nextCheckIn) setCheckOut('');
                    setFormError('');
                  }}
                  style={s.dateInput}
                  required
                />
              </div>
              <div style={s.dateDivider} />
              <div style={s.dateField}>
                <label style={s.fieldLabel}>체크아웃</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => {
                    setCheckOut(e.target.value);
                    setFormError('');
                  }}
                  style={s.dateInput}
                  required
                />
              </div>
            </div>
          </div>

          <hr style={s.hr} />

          {/* 인원 */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>인원</h2>
            <div style={s.guestRow}>
              <div>
                <p style={s.guestLabel}>성인</p>
                <p style={s.guestSub}>만 13세 이상</p>
              </div>
              <GuestCounter value={guests} onChange={setGuests} min={1} max={10} />
            </div>
          </div>

          <hr style={s.hr} />

          {/* 예약자 정보 */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>예약자 정보</h2>
            <label style={s.label}>이름 <span style={{ color: C.primary }}>*</span></label>
            <input style={s.input} value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="예약자 이름" required />
              <label style={{ ...s.label, marginTop: '12px' }}>연락처</label>
            <input
              style={s.input}
              value={guestPhone}
              onChange={e => {
                setGuestPhone(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="010-0000-0000"
              required
            />
          </div>

          <hr style={s.hr} />

          <div style={s.section}>
            <h2 style={s.sectionTitle}>혜택 적용</h2>
            <div style={s.benefitCard}>
              <label style={s.label}>쿠폰 선택</label>
              <select
                style={s.input}
                value={selectedCouponNo}
                onChange={(e) => setSelectedCouponNo(e.target.value)}
              >
                <option value="">적용 안 함</option>
                {couponItems.filter((item) => item.status === 'ISSUED').map((item) => (
                  <option key={item.couponNo} value={item.couponNo}>
                    {item.couponName} · {item.discountLabel}
                  </option>
                ))}
              </select>
              {selectedCoupon && basePrice < selectedCoupon.minOrderAmount && (
                <p style={s.benefitHintError}>이 쿠폰은 {selectedCoupon.minOrderAmount.toLocaleString()}원 이상에서 사용 가능합니다.</p>
              )}
              {selectedCoupon && basePrice >= selectedCoupon.minOrderAmount && (
                <p style={s.benefitHint}>쿠폰 할인 {couponDiscount.toLocaleString()}원 적용 예정</p>
              )}

              <label style={{ ...s.label, marginTop: '14px' }}>포인트 사용</label>
              <input
                style={s.input}
                type="number"
                min="0"
                max={benefitSnapshot.mileageBalance}
                step="100"
                value={useMileage}
                onChange={(e) => setUseMileage(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="0"
              />
              <div style={s.mileageRow}>
                <span>보유 포인트 {benefitSnapshot.mileageBalance.toLocaleString()}P</span>
                <button type="button" style={s.textButton} onClick={() => setUseMileage(Math.min(benefitSnapshot.mileageBalance, mileageCap))}>전액 사용</button>
              </div>
              <p style={s.benefitHint}>이번 예약 적립 예정 {expectedMileage.toLocaleString()}P</p>
            </div>
          </div>

          <hr style={s.hr} />

          <button
            type="submit"
            style={s.submitBtn}
            className="tz-booking-submit-btn"
          >
            예약 확정
          </button>
          {formError && <p style={s.formError}>{formError}</p>}
        </form>

        {/* ── 우측 요약 ── */}
        <div style={s.summary} className="tz-booking-summary">
          <div style={s.summaryCard} className="tz-booking-summary-card">
            {lodging.thumbnailUrl && (
              <img src={lodging.thumbnailUrl} alt={lodging.name} style={s.summaryImg} />
            )}
            <p style={s.summaryRegion}>{lodging.region}</p>
            <p style={s.summaryName}>{lodging.name}</p>
            <hr style={s.hr} />
            <div style={s.priceRow}>
              <span>{(lodging.pricePerNight || 0).toLocaleString()}원 × {nights || 0}박</span>
              <span>{basePrice.toLocaleString()}원</span>
            </div>
            <div style={s.priceRowMuted}>
              <span>쿠폰 할인</span>
              <span>-{couponDiscount.toLocaleString()}원</span>
            </div>
            <div style={s.priceRowMuted}>
              <span>포인트 사용</span>
              <span>-{appliedMileage.toLocaleString()}원</span>
            </div>
            <hr style={s.hr} />
            <div style={{ ...s.priceRow, fontWeight: '700', fontSize: '16px' }}>
              <span>총 합계</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            <p style={s.summaryHint}>예약 완료 시 {expectedMileage.toLocaleString()}P 적립 예정</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: MAX_WIDTH, margin: '0 auto', padding: '32px 24px 64px' },
  back: { fontSize: '14px', color: C.textSub, textDecoration: 'none', display: 'inline-block', marginBottom: '24px' },
  errorCard: {
    maxWidth: '720px',
    margin: '80px auto',
    padding: '32px',
    borderRadius: '24px',
    background: '#fff',
    border: `1px solid ${C.borderLight}`,
    boxShadow: S.card,
    textAlign: 'center',
  },
  errorTitle: { margin: '0 0 12px', fontSize: '28px', fontWeight: '700', color: C.text },
  errorText: { margin: '0 0 20px', fontSize: '15px', lineHeight: 1.7, color: C.textSub },
  errorActions: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' },
  backToListBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 18px',
    borderRadius: '999px',
    textDecoration: 'none',
    border: `1px solid ${C.border}`,
    background: '#fff',
    color: C.text,
    fontWeight: '700',
  },
  retryBtn: {
    border: 'none',
    borderRadius: '999px',
    background: `linear-gradient(to right, ${C.primary}, #E31C5F)`,
    color: '#fff',
    padding: '12px 18px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  title: { fontSize: '28px', fontWeight: '700', color: C.text, margin: '0 0 32px' },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'clamp(24px, 5vw, 64px)',
    alignItems: 'flex-start',
  },
  form: { flex: 1, minWidth: 0 },
  section: { paddingBottom: '8px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: C.text, margin: '0 0 20px' },
  dateCard: { border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: 'hidden', display: 'flex' },
  dateField: { flex: 1, padding: '14px 16px' },
  dateDivider: { width: '1px', background: C.border },
  fieldLabel: { display: 'block', fontSize: '10px', fontWeight: '700', color: C.text, marginBottom: '6px', letterSpacing: '0.05em' },
  dateInput: { border: 'none', outline: 'none', fontSize: '15px', color: C.text, width: '100%', background: 'transparent', padding: 0 },
  hr: { border: 'none', borderTop: `1px solid ${C.borderLight}`, margin: '28px 0' },
  guestRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  guestLabel: { fontSize: '16px', fontWeight: '500', color: C.text, margin: '0 0 2px' },
  guestSub: { fontSize: '13px', color: C.textSub, margin: 0 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: C.text, marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: R.md, fontSize: '15px', color: C.text, boxSizing: 'border-box', outline: 'none' },
  benefitCard: { border: `1px solid ${C.borderLight}`, borderRadius: '16px', padding: '16px', background: '#FBFBFB' },
  benefitHint: { margin: '8px 0 0', fontSize: '12px', color: '#4B5563', fontWeight: 600 },
  benefitHintError: { margin: '8px 0 0', fontSize: '12px', color: '#B91C1C', fontWeight: 600 },
  mileageRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: C.textSub },
  textButton: { border: 'none', background: 'none', color: C.primary, fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 },
  submitBtn: { width: '100%', padding: '16px', background: `linear-gradient(to right, ${C.primary}, #E31C5F)`, color: '#fff', border: 'none', borderRadius: R.md, fontSize: '16px', fontWeight: '700' },
  formError: { margin: '10px 0 0', fontSize: '13px', color: '#DC2626', fontWeight: 600 },
  summary: { width: '100%', maxWidth: '340px', justifySelf: 'end' },
  summaryCard: { border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', boxShadow: S.card, position: 'sticky', top: '100px' },
  summaryImg: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: R.lg, display: 'block', marginBottom: '16px' },
  summaryRegion: { fontSize: '12px', color: C.textSub, margin: '0 0 4px' },
  summaryName: { fontSize: '16px', fontWeight: '700', color: C.text, margin: 0 },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: C.text },
  priceRowMuted: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: C.textSub, marginTop: '10px' },
  summaryHint: { margin: '14px 0 0', fontSize: '12px', color: '#4B5563', fontWeight: 600 },
};
