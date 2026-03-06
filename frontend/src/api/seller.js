import apiClient from './apiClient';

export const getSellerLodgings = () => apiClient.get('/api/v1/seller/lodgings');
export const getSellerBookings = () => apiClient.get('/api/v1/seller/bookings');
