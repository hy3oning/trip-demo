import { REVIEW_MOCK_ITEMS, REVIEW_SUMMARY_BY_LODGING } from '../mock/reviewMockData';

const REVIEW_STORAGE_KEY = 'tripzone-review-v1';

function readReviews() {
  try {
    const raw = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) return REVIEW_MOCK_ITEMS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.items) ? parsed.items : REVIEW_MOCK_ITEMS;
  } catch {
    return REVIEW_MOCK_ITEMS;
  }
}

function writeReviews(items) {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify({ items }));
}

function getInitialItemsForLodging(lodgingId) {
  return REVIEW_MOCK_ITEMS.filter((item) => Number(item.lodgingId) === Number(lodgingId));
}

export function getReviewsByLodging(lodgingId, currentUserId) {
  return readReviews()
    .filter((item) => Number(item.lodgingId) === Number(lodgingId))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map((item) => ({
      ...item,
      canEdit: Number(item.userId) === Number(currentUserId),
      canDelete: Number(item.userId) === Number(currentUserId),
    }));
}

export function getReviewSummary(lodgingId) {
  const base = REVIEW_SUMMARY_BY_LODGING[Number(lodgingId)] || {
    averageRating: 0,
    reviewCount: 0,
    photoReviewCount: 0,
  };

  const currentItems = readReviews().filter((item) => Number(item.lodgingId) === Number(lodgingId));
  const initialItems = getInitialItemsForLodging(lodgingId);

  const currentCount = currentItems.length;
  const initialCount = initialItems.length;
  const currentPhotoCount = currentItems.filter((item) => item.imageUrls?.length).length;
  const initialPhotoCount = initialItems.filter((item) => item.imageUrls?.length).length;
  const currentRatingSum = currentItems.reduce((acc, item) => acc + Number(item.rating || 0), 0);
  const initialRatingSum = initialItems.reduce((acc, item) => acc + Number(item.rating || 0), 0);

  const nextReviewCount = Math.max(0, base.reviewCount + (currentCount - initialCount));
  const nextPhotoReviewCount = Math.max(0, base.photoReviewCount + (currentPhotoCount - initialPhotoCount));
  const nextRatingSum = base.averageRating * base.reviewCount + (currentRatingSum - initialRatingSum);
  const nextAverageRating = nextReviewCount ? nextRatingSum / nextReviewCount : 0;

  return {
    averageRating: Number(nextAverageRating.toFixed(1)),
    reviewCount: nextReviewCount,
    photoReviewCount: nextPhotoReviewCount,
  };
}

export function getReviewEligibility(user, lodgingId) {
  if (!user) {
    return {
      canWrite: false,
      reason: 'LOGIN_REQUIRED',
      bookingId: null,
    };
  }

  const alreadyReviewed = readReviews().some(
    (item) => Number(item.lodgingId) === Number(lodgingId) && Number(item.userId) === Number(user.userId)
  );

  if (alreadyReviewed) {
    return {
      canWrite: false,
      reason: 'ALREADY_REVIEWED',
      bookingId: null,
    };
  }

  return {
    canWrite: true,
    reason: '',
    bookingId: Date.now(),
  };
}

export function createReview({ lodgingId, user, rating, content, imageUrls }) {
  const current = readReviews();
  const nextItem = {
    reviewId: Date.now(),
    lodgingId: Number(lodgingId),
    bookingId: Date.now(),
    userId: Number(user.userId),
    authorName: user.name || '게스트',
    rating: Number(rating),
    content: String(content || '').trim(),
    imageUrls: Array.isArray(imageUrls) ? imageUrls.slice(0, 5) : [],
    createdAt: new Date().toISOString().slice(0, 10),
    canEdit: true,
    canDelete: true,
  };

  writeReviews([nextItem, ...current]);
  return nextItem;
}

export function deleteReview(reviewId, currentUserId) {
  const current = readReviews();
  const target = current.find((item) => Number(item.reviewId) === Number(reviewId));
  if (!target) return false;
  if (Number(target.userId) !== Number(currentUserId)) return false;
  writeReviews(current.filter((item) => Number(item.reviewId) !== Number(reviewId)));
  return true;
}
