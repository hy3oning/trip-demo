import { useEffect, useState } from 'react';
import { getWishlistItems, isWishlisted, isWishlistedVariant, removeWishlistItem, toggleWishlist } from '../utils/wishlistMock';

export function useWishlist() {
  const [items, setItems] = useState(() => getWishlistItems());

  useEffect(() => {
    const sync = () => setItems(getWishlistItems());
    window.addEventListener('tripzone:wishlist-updated', sync);
    return () => window.removeEventListener('tripzone:wishlist-updated', sync);
  }, []);

  return {
    wishlistItems: items,
    isWishlisted: (lodgingId) => isWishlisted(lodgingId),
    isWishlistedVariant: (lodgingId, cardKey) => isWishlistedVariant(lodgingId, cardKey),
    removeWishlistItem: (lodgingId) => {
      removeWishlistItem(lodgingId);
      setItems(getWishlistItems());
    },
    toggleWishlist: (lodging) => {
      const result = toggleWishlist(lodging);
      setItems(getWishlistItems());
      return result;
    },
  };
}
