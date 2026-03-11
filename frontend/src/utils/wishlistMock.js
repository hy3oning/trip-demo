const WISHLIST_STORAGE_KEY = 'tripzone-wishlist-v1';

function normalizeWishlistItem(lodging) {
  if (!lodging) return null;

  const lodgingId = Number(lodging.lodgingId ?? lodging.id);
  if (!lodgingId) return null;

  return {
    lodgingId,
    displayCardKey: lodging.displayCardKey || lodging.cardKey || null,
    name: lodging.name || '',
    region: lodging.region || '',
    address: lodging.address || '',
    thumbnailUrl: lodging.thumbnailUrl || lodging.imageUrl || '',
    pricePerNight: Number(lodging.pricePerNight || 0),
    rating: Number(lodging.rating || 0),
    reviewCount: Number(lodging.reviewCount || 0),
    savedAt: lodging.savedAt || new Date().toISOString(),
  };
}

function readWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function writeWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({ items }));
  window.dispatchEvent(new CustomEvent('tripzone:wishlist-updated'));
}

export function getWishlistItems() {
  return readWishlist().sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}

export function isWishlisted(lodgingId) {
  return readWishlist().some((item) => Number(item.lodgingId) === Number(lodgingId));
}

export function isWishlistedVariant(lodgingId, cardKey) {
  const matchedItem = readWishlist().find((item) => Number(item.lodgingId) === Number(lodgingId));
  if (!matchedItem) return false;
  if (!matchedItem.displayCardKey) return true;
  return matchedItem.displayCardKey === cardKey;
}

export function toggleWishlist(lodging) {
  const item = normalizeWishlistItem(lodging);
  if (!item) return { added: false, items: readWishlist() };

  const current = readWishlist();
  const exists = current.some((wishlistItem) => Number(wishlistItem.lodgingId) === item.lodgingId);

  const nextItems = exists
    ? current.filter((wishlistItem) => Number(wishlistItem.lodgingId) !== item.lodgingId)
    : [{ ...item, savedAt: new Date().toISOString() }, ...current];

  writeWishlist(nextItems);
  return { added: !exists, items: nextItems };
}

export function removeWishlistItem(lodgingId) {
  const current = readWishlist();
  const nextItems = current.filter((wishlistItem) => Number(wishlistItem.lodgingId) !== Number(lodgingId));
  writeWishlist(nextItems);
  return nextItems;
}
