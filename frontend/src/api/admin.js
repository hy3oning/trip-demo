import apiClient from './apiClient';

export const getAdminUsers = () => apiClient.get('/api/v1/admin/users');
export const getAdminSellers = () => apiClient.get('/api/v1/admin/sellers');
export const getAdminInquiries = () => apiClient.get('/api/v1/admin/inquiries');
