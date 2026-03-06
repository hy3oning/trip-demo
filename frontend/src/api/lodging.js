import apiClient from './apiClient';

export const getLodgings = (params) => apiClient.get('/api/v1/lodgings', { params });
export const getLodging = (lodgingId) => apiClient.get(`/api/v1/lodgings/${lodgingId}`);
export const createLodging = (data) => apiClient.post('/api/v1/lodgings', data);
export const updateLodging = (lodgingId, data) => apiClient.patch(`/api/v1/lodgings/${lodgingId}`, data);
export const deleteLodging = (lodgingId) => apiClient.delete(`/api/v1/lodgings/${lodgingId}`);
