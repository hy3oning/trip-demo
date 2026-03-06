import apiClient from './apiClient';

export const createInquiry = (data) => apiClient.post('/api/v1/inquiries', data);
export const getMyInquiries = (userId) => apiClient.get('/api/v1/inquiries', { params: { userId } });
export const getInquiry = (inquiryId) => apiClient.get(`/api/v1/inquiries/${inquiryId}`);
export const updateInquiry = (inquiryId, data) => apiClient.patch(`/api/v1/inquiries/${inquiryId}`, data);
export const deleteInquiry = (inquiryId) => apiClient.delete(`/api/v1/inquiries/${inquiryId}`);
