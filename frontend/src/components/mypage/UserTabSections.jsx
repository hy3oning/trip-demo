import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { updateUser } from '../../api/auth';
import { benefitSnapshot, couponItems, gradeGuide, mileageItems } from '../../mock/benefitsData';
import { MOCK_LODGINGS } from '../../mock/mockData';
import { C } from '../../styles/tokens';
import { buildCouponDestination, buildPointsDestination } from '../../utils/benefitNavigation';
import { buildAttendanceMileageItems, getPendingAttendancePoint } from '../../utils/attendanceMock';
import { useWishlist } from '../../hooks/useWishlist';

export function BookingsList({ bookings }) {
  if (!bookings.length) return <p style={{ color: C.textSub, padding: '20px 0' }}>예약 내역이 없습니다.</p>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {bookings.map((b) => (
        <div key={b.bookingId ?? b.id} style={sCard.card}>
          <img src={b.thumbnailUrl} alt={b.lodgingName} style={sCard.img} />
          <div style={sCard.body}>
            <div style={sCard.header}>
              <h3 style={sCard.name}>{b.lodgingName}</h3>
              <Badge status={b.bookingStatus} />
            </div>
            <p style={sCard.meta}>{b.checkIn} ~ {b.checkOut} · {b.guests}명</p>
            <p style={sCard.price}>{Number(b.totalPrice || 0).toLocaleString()}원</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyInfoSection({ user, logout, updateCurrentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: '01012345678',
    birthdate: '',
    gender: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await updateUser(user.userId || user.id || 1, { name: formData.name });
      updateCurrentUser({ name: formData.name });
      setSaveMessage('회원 정보가 저장되었습니다.');
      setSaveError('');
      setIsEditing(false);
    } catch {
      setSaveError('정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setSaveMessage('');
    }
  };

  return (
    <div style={sInfo.wrap}>
      <div style={sInfo.header}>
        <div style={sInfo.avatarWrap}>
          <div style={{ ...s.avatar, width: '64px', height: '64px', fontSize: '28px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={sInfo.desc}>회원 정보</p>
            <p style={sInfo.subDesc}>내 정보를 원하시는 대로 관리하세요.</p>
          </div>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={sInfo.textBtnGray} onClick={() => setIsEditing(false)}>취소</button>
              <button style={{ ...sInfo.textBtn, background: C.primary, color: '#fff', padding: '8px 16px', borderRadius: '8px' }} onClick={handleSave}>저장</button>
            </div>
          ) : (
            <button style={sInfo.textBtn} onClick={() => setIsEditing(true)}>수정하기</button>
          )}
        </div>
      </div>

      <div style={sInfo.secureAlert}>
        <div style={sInfo.secureAlertText}>🔒 가려진 내 정보를 확인할 수 있어요!</div>
        <div style={sInfo.secureToggle}>
          <div style={sInfo.secureToggleKnob} />
        </div>
      </div>

      {saveMessage ? <p style={sInfo.successText}>{saveMessage}</p> : null}
      {saveError ? <p style={sInfo.errorText}>{saveError}</p> : null}

      <div style={sInfo.grid}>
        <Field label="닉네임" isEditing={isEditing}>
          {isEditing ? <input name="name" style={sInfo.inputEdit} value={formData.name} onChange={handleChange} /> : <div style={sInfo.inputVal}>{formData.name}</div>}
        </Field>
        <Field label="휴대폰 번호" isEditing={isEditing}>
          {isEditing ? <input name="phone" style={sInfo.inputEdit} value={formData.phone} onChange={handleChange} /> : <div style={formData.phone ? sInfo.inputVal : sInfo.inputMuted}>{formData.phone ? formData.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3') : '미입력(앱에서 입력해 주세요.)'}</div>}
        </Field>
        <Field label="생년월일" isEditing={isEditing}>
          {isEditing ? <input name="birthdate" type="date" style={sInfo.inputEdit} value={formData.birthdate} onChange={handleChange} /> : <div style={formData.birthdate ? sInfo.inputVal : sInfo.inputMuted}>{formData.birthdate || '미입력(앱에서 입력해 주세요.)'}</div>}
        </Field>
        <Field label="성별" isEditing={isEditing}>
          {isEditing ? (
            <select name="gender" style={sInfo.inputEdit} value={formData.gender} onChange={handleChange}>
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          ) : (
            <div style={formData.gender ? sInfo.inputVal : sInfo.inputMuted}>
              {formData.gender === 'M' ? '남성' : formData.gender === 'F' ? '여성' : '미입력(앱에서 입력해 주세요.)'}
            </div>
          )}
        </Field>
      </div>

      <div style={sInfo.deviceWrap}>
        <div style={sInfo.deviceHeader}>
          <h3 style={sInfo.deviceTitle}>접속 기기 관리</h3>
          <button style={sInfo.textBtn} onClick={logout}>전체 로그아웃</button>
        </div>
        <p style={sInfo.deviceDesc}>로그인 된 모든 기기에서 로그아웃 돼요.</p>
      </div>

      <div style={sInfo.footer}>
        <span style={{ color: '#999' }}>더 이상 TripZone 이용을 원하지 않으신가요? </span>
        <button style={sInfo.textBtnGray}>회원탈퇴</button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={sInfo.field}>
      <label style={sInfo.label}>{label}</label>
      {children}
    </div>
  );
}

function ConsentToggle({ checked, onClick }) {
  return (
    <button
      type="button"
      style={{ ...sInfo.secureToggle, background: checked ? C.primary : '#DCDCDC', border: 'none', cursor: 'pointer' }}
      onClick={onClick}
    >
      <div style={{ ...sInfo.secureToggleKnob, transform: checked ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
    </button>
  );
}

export function SettingsSection() {
  const [consents, setConsents] = useState({ marketing: true, email: false, sms: true });
  const [saveMessage, setSaveMessage] = useState('');

  const toggleConsent = (key) => setConsents((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={sInfo.wrap}>
      <div style={{ ...sInfo.header, paddingBottom: '24px', borderBottom: '1px solid #F0EFEF' }}>
        <div style={{ flex: 1 }}>
          <p style={sInfo.desc}>마케팅 정보 수신</p>
          <p style={sInfo.subDesc}>다양한 혜택과 이벤트 소식을 받아보세요.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ToggleRow label="마케팅 정보 수신 동의" checked={consents.marketing} onClick={() => toggleConsent('marketing')} strong />
        <ToggleRow label="이메일 수신" checked={consents.email} onClick={() => toggleConsent('email')} nested />
        <ToggleRow label="SMS 수신" checked={consents.sms} onClick={() => toggleConsent('sms')} nested />
      </div>

      {saveMessage ? <p style={sInfo.successText}>{saveMessage}</p> : null}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
        <button
          style={{ ...sInfo.textBtn, background: C.primary, color: '#fff', padding: '12px 32px', borderRadius: '12px', fontSize: '16px' }}
          onClick={() => setSaveMessage('설정이 저장되었습니다.')}
        >
          변경 사항 저장
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onClick, strong = false, nested = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: nested ? '16px' : 0 }}>
      <span style={{ fontSize: strong ? '16px' : '15px', fontWeight: strong ? '700' : '400', color: strong ? C.text : '#444' }}>{label}</span>
      <ConsentToggle checked={checked} onClick={onClick} />
    </div>
  );
}

function formatWon(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

export function GradeSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={sBenefit.hero}>
        <div>
          <p style={sBenefit.heroEyebrow}>현재 등급</p>
          <h3 style={sBenefit.heroTitle}>{benefitSnapshot.currentGrade}</h3>
          <p style={sBenefit.heroDesc}>다음 등급인 {benefitSnapshot.nextGrade}까지 예약 {benefitSnapshot.nextGradeRemainBookings}회가 남아 있습니다.</p>
        </div>
        <div style={sBenefit.heroMeta}>
          <div>
            <p style={sBenefit.metaValue}>{benefitSnapshot.annualStayCount}회</p>
            <p style={sBenefit.metaLabel}>누적 숙박 횟수</p>
          </div>
          <div>
            <p style={sBenefit.metaValue}>{formatWon(benefitSnapshot.annualSpendAmount)}</p>
            <p style={sBenefit.metaLabel}>누적 결제 금액</p>
          </div>
        </div>
      </div>

      <div style={sBenefit.gradeGrid}>
        {gradeGuide.map((item) => (
          <article key={item.code} style={{ ...sBenefit.gradeCard, background: item.bg, color: item.textColor || C.text }}>
            <div style={sBenefit.gradeTop}>
              <span style={{ ...sBenefit.gradeName, color: item.accent }}>{item.name}</span>
              <span style={{ ...sBenefit.gradeRate, color: item.accent }}>{item.mileageRate}% 적립</span>
            </div>
            <p style={{ ...sBenefit.gradeCondition, color: item.textColor || C.text }}>누적 결제 {formatWon(item.minTotalAmount)} 또는 {item.minStayCount}회 숙박</p>
            <p style={{ ...sBenefit.gradeBenefit, color: item.textColor === '#F9FAFB' ? 'rgba(249,250,251,0.84)' : C.textSub }}>{item.benefit}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function PointsSection() {
  const navigate = useNavigate();
  // TODO(back-end): 출석체크 적립 이력은 포인트 이력 응답에 합쳐 내려주면 현재 UI를 그대로 유지할 수 있다.
  const attendanceMileageItems = buildAttendanceMileageItems();
  const mergedMileageItems = [...attendanceMileageItems, ...mileageItems].sort((a, b) => b.regDate.localeCompare(a.regDate));
  const pendingAttendancePoint = getPendingAttendancePoint();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={sBenefit.couponToolbar}>
        <button type="button" style={sBenefit.couponWalletBtn} onClick={() => navigate('/points')}>
          포인트함 전체 보기
        </button>
      </div>
      <div style={sBenefit.summaryRow}>
        <article style={sBenefit.summaryCard}>
          <p style={sBenefit.summaryLabel}>보유 포인트</p>
          <p style={sBenefit.summaryValue}>{benefitSnapshot.mileageBalance.toLocaleString()}P</p>
          <p style={sBenefit.summarySub}>예약 완료, 리뷰 작성, 이벤트 참여로 적립됩니다.</p>
          <button type="button" style={sBenefit.pointsActionBtn} onClick={() => navigate(buildPointsDestination())}>사용하러 가기</button>
        </article>
        <article style={sBenefit.summaryCard}>
          <p style={sBenefit.summaryLabel}>적립 예정 혜택</p>
          <p style={sBenefit.summaryValue}>{gradeGuide.find((item) => item.name === benefitSnapshot.currentGrade)?.mileageRate || 1}%</p>
          <p style={sBenefit.summarySub}>현재 등급 기준 예약 결제액 적립률입니다.</p>
        </article>
        <article style={sBenefit.summaryCard}>
          <p style={sBenefit.summaryLabel}>출석 적립 예정</p>
          <p style={sBenefit.summaryValue}>{pendingAttendancePoint.toLocaleString()}P</p>
          <p style={sBenefit.summarySub}>출석체크에서 적립 예정인 mock 포인트입니다.</p>
        </article>
      </div>

      <div style={sBenefit.listWrap}>
        {mergedMileageItems.map((item) => (
          <div key={item.mileageHistoryNo} style={sBenefit.listRow}>
            <div>
              <p style={sBenefit.listTitle}>{item.reason}</p>
              <p style={sBenefit.listMeta}>
                {item.regDate}
                {item.balanceAfter !== null ? ` · 잔액 ${item.balanceAfter.toLocaleString()}P` : ' · 서버 반영 대기'}
              </p>
            </div>
            <div style={sBenefit.amountWrap}>
              <div style={{ ...sBenefit.amount, color: item.changeAmount > 0 ? C.success : C.text }}>
                {item.changeAmount > 0 ? '+' : ''}{item.changeAmount.toLocaleString()}P
              </div>
              {item.status === 'MOCK_PENDING' ? <span style={sBenefit.pendingBadge}>출석 적립 예정</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CouponsSection() {
  const navigate = useNavigate();
  // TODO(back-end): 쿠폰별 적용 가능 카테고리/국내·해외 구분 응답을 받으면 목적지를 조건별 숙소 목록으로 교체한다.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={sBenefit.couponToolbar}>
        <button type="button" style={sBenefit.couponWalletBtn} onClick={() => navigate('/coupons')}>
          쿠폰함 전체 보기
        </button>
      </div>
      {couponItems.map((coupon) => (
        <article key={coupon.couponNo} style={sBenefit.couponCard}>
          <div style={sBenefit.couponMain}>
            <div style={sBenefit.couponBadge}>{coupon.channel}</div>
            <h3 style={sBenefit.couponTitle}>{coupon.couponName}</h3>
            <p style={sBenefit.couponMeta}>{coupon.discountLabel} · {coupon.maxDiscountLabel} · {formatWon(coupon.minOrderAmount)} 이상</p>
          </div>
          <div style={sBenefit.couponSide}>
            <div style={{ ...sBenefit.couponStatus, color: coupon.status === 'ISSUED' ? C.success : C.textLight, background: coupon.status === 'ISSUED' ? C.successBg : '#F3F4F6' }}>
              {coupon.status}
            </div>
            <p style={sBenefit.couponExpire}>{coupon.expiredAt}까지</p>
            <button type="button" style={sBenefit.couponActionBtn} onClick={() => navigate(buildCouponDestination(coupon))}>
              사용하러 가기
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export function WishlistSection() {
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  const items = wishlistItems.slice(0, 4);

  if (!items.length) {
    return (
      <div style={sWish.emptyCard}>
        <p style={sWish.emptyTitle}>아직 찜한 숙소가 없습니다.</p>
        <p style={sWish.emptyDesc}>메인 화면과 숙소 목록의 하트를 눌러 바로 추가할 수 있습니다.</p>
        <button type="button" style={sWish.emptyButton} onClick={() => navigate('/lodgings')}>숙소 둘러보기</button>
      </div>
    );
  }

  return (
    <div style={sWish.grid}>
      {items.map((item) => (
        <article key={item.lodgingId} style={sWish.card}>
          <div style={sWish.imageWrap}>
            <img src={item.thumbnailUrl} alt={item.name} style={sWish.image} />
            <span style={sWish.badge}>찜한 숙소</span>
          </div>
          <div style={sWish.body}>
            <p style={sWish.region}>{item.region}</p>
            <h3 style={sWish.name}>{item.name}</h3>
            <p style={sWish.meta}>★ {item.rating} · 후기 {item.reviewCount}개</p>
            <p style={sWish.price}>{Number(item.pricePerNight || 0).toLocaleString()}원 / 1박</p>
            <button type="button" style={sWish.button} onClick={() => navigate(`/lodgings/${item.lodgingId}`)}>상세 보기</button>
          </div>
        </article>
      ))}
    </div>
  );
}

const s = {
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: C.primary,
    color: '#fff',
    fontSize: '24px',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(232,72,74,0.3)',
  },
};

const sCard = {
  card: { display: 'flex', gap: '24px', border: '1px solid #F0EFEF', borderRadius: '20px', overflow: 'hidden', padding: '24px', background: '#fff', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' },
  img: { width: '140px', height: '110px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 },
  body: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  name: { fontSize: '18px', fontWeight: '800', color: C.text, margin: 0 },
  meta: { fontSize: '14px', color: '#6A6A6A', margin: '0 0 12px' },
  price: { fontSize: '18px', fontWeight: '800', color: C.text, margin: 0 },
};

const sBenefit = {
  hero: { borderRadius: '24px', padding: '24px', background: 'linear-gradient(135deg, #151515 0%, #343434 100%)', color: '#fff', display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap' },
  heroEyebrow: { margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 },
  heroTitle: { margin: '10px 0 8px', fontSize: '32px', fontWeight: 800 },
  heroDesc: { margin: 0, fontSize: '14px', lineHeight: 1.7, maxWidth: '520px', opacity: 0.9 },
  heroMeta: { display: 'flex', gap: '28px', flexWrap: 'wrap' },
  metaValue: { margin: 0, fontSize: '24px', fontWeight: 800 },
  metaLabel: { margin: '6px 0 0', fontSize: '12px', opacity: 0.72 },
  gradeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  gradeCard: { borderRadius: '18px', padding: '20px', minHeight: '172px', border: `1px solid ${C.borderLight}` },
  gradeTop: { display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', marginBottom: '14px' },
  gradeName: { fontSize: '18px', fontWeight: 800 },
  gradeRate: { fontSize: '13px', fontWeight: 700 },
  gradeCondition: { margin: '0 0 10px', fontSize: '14px', lineHeight: 1.6, color: C.text },
  gradeBenefit: { margin: 0, fontSize: '13px', lineHeight: 1.7, color: C.textSub },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  summaryCard: { border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '22px', background: '#fff' },
  summaryLabel: { margin: 0, fontSize: '13px', color: C.textSub, fontWeight: 700 },
  summaryValue: { margin: '10px 0 8px', fontSize: '28px', fontWeight: 800, color: C.text },
  summarySub: { margin: 0, fontSize: '13px', lineHeight: 1.6, color: C.textSub },
  pointsActionBtn: { marginTop: '14px', border: 'none', borderRadius: '12px', background: '#FFF1F1', color: C.primary, padding: '10px 14px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' },
  listWrap: { border: `1px solid ${C.borderLight}`, borderRadius: '20px', overflow: 'hidden', background: '#fff' },
  listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '18px 20px', borderBottom: `1px solid ${C.borderLight}` },
  listTitle: { margin: 0, fontSize: '15px', fontWeight: 700, color: C.text },
  listMeta: { margin: '6px 0 0', fontSize: '12px', color: C.textLight },
  amount: { fontSize: '16px', fontWeight: 800 },
  amountWrap: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  pendingBadge: { display: 'inline-flex', padding: '5px 9px', borderRadius: '999px', background: '#FFF3D6', color: '#A16207', fontSize: '11px', fontWeight: '800' },
  couponToolbar: { display: 'flex', justifyContent: 'flex-end' },
  couponWalletBtn: { border: `1px solid ${C.border}`, borderRadius: '999px', background: '#fff', color: C.text, padding: '10px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
  couponCard: { border: `1px solid ${C.borderLight}`, borderRadius: '20px', padding: '20px', background: '#fff', display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' },
  couponMain: { flex: 1 },
  couponBadge: { display: 'inline-block', padding: '5px 8px', borderRadius: '999px', background: '#FEF3C7', color: '#92400E', fontSize: '11px', fontWeight: 700, marginBottom: '10px' },
  couponTitle: { margin: 0, fontSize: '18px', fontWeight: 800, color: C.text },
  couponMeta: { margin: '8px 0 0', fontSize: '13px', color: C.textSub, lineHeight: 1.6 },
  couponSide: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  couponStatus: { padding: '6px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 },
  couponExpire: { margin: 0, fontSize: '12px', color: C.textLight },
  couponActionBtn: { border: 'none', borderRadius: '999px', background: 'linear-gradient(135deg, #F05A5C 0%, #E8484A 100%)', color: '#fff', padding: '10px 14px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' },
};

const sWish = {
  emptyCard: { border: `1px solid ${C.borderLight}`, borderRadius: '20px', background: '#fff', padding: '34px 24px', textAlign: 'center' },
  emptyTitle: { margin: '0 0 8px', fontSize: '22px', fontWeight: '800', color: C.text },
  emptyDesc: { margin: '0 0 16px', fontSize: '14px', color: C.textSub, lineHeight: 1.7 },
  emptyButton: { border: '1px solid #F1B3B3', background: '#FFF6F6', color: '#C13A3D', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' },
  card: { border: `1px solid ${C.borderLight}`, borderRadius: '20px', overflow: 'hidden', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' },
  imageWrap: { position: 'relative', height: '180px', background: '#F8F8F8' },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  badge: { position: 'absolute', top: '12px', left: '12px', fontSize: '11px', fontWeight: 700, color: '#fff', background: 'rgba(17,17,17,0.72)', padding: '5px 9px', borderRadius: '999px' },
  body: { padding: '16px' },
  region: { margin: '0 0 4px', fontSize: '12px', color: C.textSub },
  name: { margin: 0, fontSize: '17px', fontWeight: 800, color: C.text },
  meta: { margin: '8px 0 10px', fontSize: '13px', color: C.textSub },
  price: { margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: C.text },
  button: { width: '100%', border: '1px solid #F1B3B3', background: '#FFF6F6', color: '#C13A3D', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' },
};

const sInfo = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '32px' },
  header: { display: 'flex', gap: '24px', alignItems: 'center' },
  avatarWrap: { width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,72,74,0.05) 0%, rgba(232,72,74,0.15) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  desc: { fontSize: '20px', fontWeight: '800', color: C.text, margin: '0 0 8px' },
  subDesc: { fontSize: '14px', color: C.textSub, margin: 0 },
  secureAlert: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FA', borderRadius: '16px', padding: '16px 24px', border: '1px solid #F0EFEF' },
  secureAlertText: { fontSize: '15px', fontWeight: '600', color: '#4A4A4A' },
  secureToggle: { width: '48px', height: '24px', borderRadius: '12px', background: '#DCDCDC', position: 'relative', cursor: 'pointer' },
  secureToggleKnob: { width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', paddingBottom: '32px', borderBottom: '1px solid #F0EFEF' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#777' },
  inputVal: { fontSize: '15px', color: '#222', padding: '16px', background: '#F8F9FA', borderRadius: '12px' },
  inputMuted: { fontSize: '15px', color: '#AAA', padding: '16px', background: '#F8F9FA', borderRadius: '12px' },
  inputEdit: { height: '52px', fontSize: '15px', color: '#1A1A1A', padding: '0 15px', background: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.primary}`, outline: 'none', width: '100%', boxSizing: 'border-box' },
  deviceWrap: { paddingBottom: '32px', borderBottom: '1px solid #F0EFEF' },
  deviceHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  deviceTitle: { fontSize: '18px', fontWeight: '700', color: C.text, margin: 0 },
  textBtn: { border: 'none', background: 'none', color: C.primary, fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  deviceDesc: { fontSize: '14px', color: C.textSub, margin: 0 },
  successText: { margin: 0, fontSize: '13px', color: '#15803D', fontWeight: 600 },
  errorText: { margin: 0, fontSize: '13px', color: '#B91C1C', fontWeight: 600 },
  footer: { display: 'flex', gap: '8px', fontSize: '13px', marginTop: '16px' },
  textBtnGray: { border: 'none', background: 'none', color: '#777', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', padding: 0 },
};
