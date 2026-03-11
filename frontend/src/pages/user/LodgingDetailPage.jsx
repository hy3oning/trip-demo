import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import BookingSummaryCard from '../../components/booking/BookingSummaryCard';
import LodgingMap from '../../components/lodging/LodgingMap';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewComposer from '../../components/review/ReviewComposer';
import { getLodging } from '../../api/lodging';
import { createReview, deleteReview, getReviewEligibility, getReviewSummary, getReviewsByLodging } from '../../utils/reviewMock';
import { C, MAX_WIDTH, R } from '../../styles/tokens';

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

export default function LodgingDetailPage() {
  const { lodgingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [lodging, setLodging] = useState(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookingError, setBookingError] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [reviewSort, setReviewSort] = useState('latest');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviews, setReviews] = useState([]);

  const nights = calcNights(checkIn, checkOut);
  const today = getTodayText();

  useEffect(() => {
    getLodging(lodgingId).then(res => setLodging(res.data)).catch(() => { });
  }, [lodgingId]);

  useEffect(() => {
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
  }, [lodgingId, user?.userId]);

  if (!lodging) return (
    <div style={{ padding: '80px', textAlign: 'center', color: C.textSub }}>
      로딩 중...
    </div>
  );

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) {
      setBookingError('체크인/체크아웃 날짜를 선택해 주세요.');
      return;
    }
    if (nights <= 0) {
      setBookingError('체크아웃은 체크인보다 이후 날짜여야 합니다.');
      return;
    }
    setBookingError('');
    navigate(`/booking/${lodgingId}`, { state: { checkIn, checkOut, guests } });
  };

  const handleInquiry = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/inquiry/create?lodgingId=${lodgingId}&type=USER_TO_SELLER`);
  };

  const liked = isWishlisted(lodgingId);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: lodging.name, text: `${lodging.name} 공유`, url: shareUrl });
        setShareMessage('공유가 완료되었습니다.');
        window.setTimeout(() => setShareMessage(''), 1400);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('링크가 복사되었습니다.');
      window.setTimeout(() => setShareMessage(''), 1400);
    } catch {
      setShareMessage('공유에 실패했습니다. 다시 시도해 주세요.');
      window.setTimeout(() => setShareMessage(''), 1800);
    }
  };

  const handleReviewImageChange = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);
    const nextImages = await Promise.all(files.map((file, index) => (
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `${file.name}-${index}-${file.size}`,
            name: file.name,
            url: String(reader.result || ''),
          });
        };
        reader.readAsDataURL(file);
      })
    )));
    setReviewImages(nextImages);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const trimmedContent = reviewContent.trim();
    if (!trimmedContent) {
      setReviewError('리뷰 내용을 입력해 주세요.');
      setReviewMessage('');
      return;
    }
    if (!user) {
      setReviewError('로그인 후 리뷰를 작성할 수 있습니다.');
      setReviewMessage('');
      return;
    }
    // TODO(back-end): 리뷰 작성 API가 준비되면 rating/content/imageUrls와 bookingId를 함께 서버에 전송한다.
    createReview({
      lodgingId,
      user,
      rating: reviewRating,
      content: trimmedContent,
      imageUrls: reviewImages.map((image) => image.url),
    });
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
    setReviewContent('');
    setReviewImages([]);
    setReviewRating(5);
    setReviewMessage('리뷰가 등록되었습니다.');
    setReviewError('');
  };

  const handleReviewDelete = (reviewId) => {
    if (!user) return;
    const deleted = deleteReview(reviewId, user.userId);
    if (!deleted) {
      setReviewError('리뷰 삭제에 실패했습니다.');
      setReviewMessage('');
      return;
    }
    setReviews(getReviewsByLodging(lodgingId, user?.userId));
    setReviewMessage('리뷰가 삭제되었습니다.');
    setReviewError('');
  };

  const reviewSummary = getReviewSummary(lodgingId);
  const reviewEligibility = getReviewEligibility(user, lodgingId);
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'rating') return b.rating - a.rating;
    if (reviewSort === 'photo') return (b.imageUrls?.length || 0) - (a.imageUrls?.length || 0);
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });

  return (
    <div>
      <style>{`
        @media (max-width: 980px) {
          .tz-lodging-gallery {
            grid-template-columns: 1fr !important;
            max-height: none !important;
          }
          .tz-lodging-main-img {
            height: 320px !important;
          }
          .tz-lodging-gallery-subs {
            flex-direction: row !important;
          }
          .tz-lodging-sub-img {
            height: 140px !important;
          }
          .tz-lodging-content {
            flex-direction: column !important;
            gap: 28px !important;
          }
          .tz-lodging-sidebar {
            width: 100% !important;
          }
          .tz-lodging-wrap {
            padding: 28px 16px 44px !important;
          }
        }
        @media (max-width: 560px) {
          .tz-lodging-main-img {
            height: 240px !important;
          }
          .tz-lodging-sub-img {
            height: 120px !important;
          }
        }
        .tz-action-btn { transition: all 0.2s ease; }
        .tz-action-btn:hover { background: #f9f9f9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .tz-lodging-img { transition: transform 0.4s ease; }
        .tz-gallery-wrap:hover .tz-lodging-img { transform: scale(1.02); }
      `}</style>
      {/* ── 이미지 갤러리 ── */}
      <div style={s.gallery} className="tz-lodging-gallery">
        <div style={s.galleryMain}>
          <img src={lodging.thumbnailUrl} alt={lodging.name} style={s.mainImg} className="tz-lodging-main-img" />
        </div>
        <div style={s.gallerySubs} className="tz-lodging-gallery-subs">
          <img src={`https://picsum.photos/seed/${lodgingId}a/400/300`} alt="" style={s.subImg} className="tz-lodging-sub-img" />
          <img src={`https://picsum.photos/seed/${lodgingId}b/400/300`} alt="" style={s.subImg} className="tz-lodging-sub-img" />
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div style={s.wrap} className="tz-lodging-wrap">
        <div style={s.content} className="tz-lodging-content">
          {/* 좌측 메인 */}
          <div style={s.main}>
            <p style={s.region}>{lodging.region}</p>
            <h1 style={s.name}>{lodging.name}</h1>
            <div style={s.meta}>
              <span>★ {lodging.rating}</span>
              <span style={s.dot}>·</span>
              <span>{lodging.reviewCount}개 후기</span>
              <span style={s.dot}>·</span>
              <span>{lodging.address}</span>
            </div>
            <div style={s.actionRow}>
              <button type="button" className="tz-action-btn" style={{ ...s.actionBtn, ...(liked ? s.actionBtnActive : null) }} onClick={() => toggleWishlist(lodging)}>
                {liked ? '♥ 찜 완료' : '♡ 찜하기'}
              </button>
              <button type="button" className="tz-action-btn" style={s.actionBtn} onClick={handleShare}>
                {shareMessage || '공유하기'}
              </button>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>숙소 소개</h2>
              <p style={s.desc}>{lodging.description}</p>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              {/* TODO(back-end): 리뷰 요약/리뷰 목록/작성 가능 여부는 아래 mock 대신 리뷰 API 응답으로 교체한다. */}
              <div style={s.reviewSectionHeader}>
                <div>
                  <h2 style={s.sectionTitle}>리뷰</h2>
                  <p style={s.reviewSectionDesc}>실제 투숙 경험을 기준으로 한 리뷰와 사진을 모아봤습니다.</p>
                </div>
                <div style={s.reviewScoreBadge}>
                  <span style={s.reviewScoreValue}>★ {reviewSummary.averageRating.toFixed(1)}</span>
                  <span style={s.reviewScoreMeta}>리뷰 {reviewSummary.reviewCount}개</span>
                </div>
              </div>

              <div style={s.reviewSummaryGrid}>
                <article style={s.reviewSummaryCard}>
                  <p style={s.reviewSummaryLabel}>평균 별점</p>
                  <p style={s.reviewSummaryValue}>{reviewSummary.averageRating.toFixed(1)}</p>
                </article>
                <article style={s.reviewSummaryCard}>
                  <p style={s.reviewSummaryLabel}>전체 리뷰</p>
                  <p style={s.reviewSummaryValue}>{reviewSummary.reviewCount}개</p>
                </article>
                <article style={s.reviewSummaryCard}>
                  <p style={s.reviewSummaryLabel}>사진 리뷰</p>
                  <p style={s.reviewSummaryValue}>{reviewSummary.photoReviewCount}개</p>
                </article>
              </div>

              <ReviewComposer
                user={user}
                canWrite={reviewEligibility.canWrite}
                reason={reviewEligibility.reason}
                rating={reviewRating}
                content={reviewContent}
                selectedImages={reviewImages}
                onRatingChange={setReviewRating}
                onContentChange={setReviewContent}
                onImageChange={handleReviewImageChange}
                onLogin={() => navigate('/login')}
                onSubmit={handleReviewSubmit}
              />

              {reviewMessage ? <p style={s.reviewSuccess}>{reviewMessage}</p> : null}
              {reviewError ? <p style={s.reviewError}>{reviewError}</p> : null}

              <div style={s.reviewSortRow}>
                {[
                  { value: 'latest', label: '최신순' },
                  { value: 'rating', label: '평점 높은순' },
                  { value: 'photo', label: '사진 리뷰' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    style={{ ...s.reviewSortBtn, ...(reviewSort === option.value ? s.reviewSortBtnActive : null) }}
                    onClick={() => setReviewSort(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div style={s.reviewList}>
                {sortedReviews.length ? (
                  sortedReviews.map((review) => <ReviewCard key={review.reviewId} review={review} onDelete={handleReviewDelete} />)
                ) : (
                  <div style={s.reviewEmpty}>
                    <p style={s.reviewEmptyTitle}>아직 리뷰가 없습니다.</p>
                    <p style={s.reviewEmptyDesc}>첫 번째 리뷰를 남겨 숙소 경험을 공유해 주세요.</p>
                  </div>
                )}
              </div>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <h2 style={s.sectionTitle}>위치</h2>
              <div style={s.mapBox}>
                <LodgingMap
                  latitude={lodging.latitude}
                  longitude={lodging.longitude}
                  name={lodging.name}
                  address={lodging.address}
                  pricePerNight={lodging.pricePerNight}
                />
              </div>
              <p style={s.mapCoord}>위도 {lodging.latitude} / 경도 {lodging.longitude}</p>
            </div>

            <hr style={s.hr} />

            <div style={s.section}>
              <button onClick={handleInquiry} style={s.inquiryBtn}>판매자에게 문의하기</button>
            </div>
          </div>

          {/* 우측 예약 카드 */}
          <div style={s.sidebar} className="tz-lodging-sidebar">
            <div style={s.inputCard}>
              <div style={s.dateRow}>
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
                      setBookingError('');
                    }}
                    style={s.dateInput}
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
                      setBookingError('');
                    }}
                    style={s.dateInput}
                  />
                </div>
              </div>
              <div style={s.guestField}>
                <label style={s.fieldLabel}>인원</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))} style={s.guestSelect}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}명</option>)}
                </select>
              </div>
            </div>
            <BookingSummaryCard
              lodging={lodging}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              onBook={handleBook}
              hideSelectionSummary
            />
            {bookingError && <p style={s.bookingError}>{bookingError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  gallery: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '8px',
    maxHeight: '520px',
    overflow: 'hidden',
    background: C.bgGray,
  },
  galleryMain: { overflow: 'hidden' },
  mainImg: { width: '100%', height: '480px', objectFit: 'cover', display: 'block' },
  gallerySubs: { display: 'flex', flexDirection: 'column', gap: '8px' },
  subImg: { width: '100%', height: '236px', objectFit: 'cover', display: 'block' },
  wrap: { maxWidth: MAX_WIDTH, margin: '0 auto', padding: '40px 24px 64px' },
  content: { display: 'flex', gap: '80px', alignItems: 'flex-start' },
  main: { flex: 1, minWidth: 0 },
  region: { fontSize: '13px', fontWeight: '600', color: C.textSub, margin: '0 0 8px' },
  name: { fontSize: '28px', fontWeight: '700', color: C.text, margin: '0 0 12px', lineHeight: 1.25 },
  meta: { display: 'flex', gap: '6px', alignItems: 'center', fontSize: '14px', color: C.text, flexWrap: 'wrap' },
  actionRow: { display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' },
  actionBtn: {
    border: `1px solid ${C.border}`,
    background: '#fff',
    color: C.text,
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  actionBtnActive: {
    borderColor: '#E8484A',
    background: '#FFF1F1',
    color: '#C13A3D',
  },
  dot: { color: C.textSub },
  hr: { border: 'none', borderTop: `1px solid ${C.borderLight}`, margin: '32px 0' },
  section: { marginBottom: '8px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: C.text, margin: '0 0 16px' },
  desc: { fontSize: '15px', lineHeight: '1.75', color: C.text, margin: 0 },
  reviewSectionHeader: { display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '16px' },
  reviewSectionDesc: { margin: 0, fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  reviewScoreBadge: {
    minWidth: '140px',
    borderRadius: '18px',
    background: 'linear-gradient(145deg, #FFF7ED 0%, #FFF1F2 100%)',
    border: '1px solid #FBD7D9',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  reviewScoreValue: { fontSize: '24px', fontWeight: 800, color: '#B45309' },
  reviewScoreMeta: { fontSize: '13px', fontWeight: 700, color: C.textSub },
  reviewSummaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '18px' },
  reviewSummaryCard: {
    borderRadius: '18px',
    border: `1px solid ${C.borderLight}`,
    background: '#fff',
    padding: '16px 18px',
  },
  reviewSummaryLabel: { margin: '0 0 8px', fontSize: '12px', color: C.textSub, fontWeight: 700 },
  reviewSummaryValue: { margin: 0, fontSize: '24px', color: C.text, fontWeight: 800 },
  reviewSortRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '18px 0 14px' },
  reviewSortBtn: {
    border: `1px solid ${C.border}`,
    borderRadius: '999px',
    background: '#fff',
    color: C.textSub,
    fontSize: '13px',
    fontWeight: 700,
    padding: '8px 13px',
    cursor: 'pointer',
  },
  reviewSortBtnActive: {
    background: '#1F2530',
    color: '#fff',
    borderColor: '#1F2530',
  },
  reviewSuccess: { margin: '12px 0 0', fontSize: '13px', color: '#15803D', fontWeight: 700 },
  reviewError: { margin: '12px 0 0', fontSize: '13px', color: '#B91C1C', fontWeight: 700 },
  reviewList: { display: 'grid', gap: '12px' },
  reviewEmpty: {
    border: `1px dashed ${C.border}`,
    borderRadius: '18px',
    background: '#FAFAFA',
    padding: '28px 20px',
    textAlign: 'center',
  },
  reviewEmptyTitle: { margin: '0 0 8px', fontSize: '18px', color: C.text, fontWeight: 800 },
  reviewEmptyDesc: { margin: 0, fontSize: '14px', color: C.textSub, lineHeight: 1.6 },
  mapBox: { borderRadius: '24px', overflow: 'hidden', border: `1px solid ${C.borderLight}`, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
  mapCoord: { fontSize: '12px', color: C.textSub, margin: '12px 0 0' },
  inquiryBtn: {
    padding: '14px 28px',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    borderRadius: '999px',
    fontSize: '15px',
    fontWeight: '700',
    color: C.text,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sidebar: { width: '380px', flexShrink: 0 },
  inputCard: {
    border: `1px solid ${C.border}`,
    borderRadius: R.lg,
    overflow: 'hidden',
    marginBottom: '16px',
  },
  dateRow: { display: 'flex', borderBottom: `1px solid ${C.border}` },
  dateField: { flex: 1, padding: '12px 16px' },
  dateDivider: { width: '1px', background: C.border },
  fieldLabel: { display: 'block', fontSize: '10px', fontWeight: '700', color: C.text, marginBottom: '4px', letterSpacing: '0.05em' },
  dateInput: { border: 'none', outline: 'none', fontSize: '14px', color: C.text, width: '100%', background: 'transparent', padding: 0 },
  guestField: { padding: '12px 16px' },
  guestSelect: { border: 'none', outline: 'none', fontSize: '14px', color: C.text, background: 'transparent', width: '100%', padding: 0, cursor: 'pointer' },
  bookingError: { margin: '10px 2px 0', color: '#DC2626', fontSize: '13px', fontWeight: 600 },
};
