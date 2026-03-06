import apiClient from './apiClient';

export const createBooking = (data) => apiClient.post('/api/v1/bookings', data);
export const getMyBookings = (userId) => apiClient.get('/api/v1/bookings', { params: { userId } });
export const cancelBooking = (bookingId) => apiClient.patch(`/api/v1/bookings/${bookingId}`, { bookingStatus: 'CANCELLED' });
export const updateBooking = (bookingId, data) => apiClient.patch(`/api/v1/bookings/${bookingId}`, data);
export const deleteBooking = (bookingId) => apiClient.delete(`/api/v1/bookings/${bookingId}`);
