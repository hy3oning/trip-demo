import apiClient from './apiClient';

export const signup = (data) => apiClient.post('/api/v1/auth/signup', data);
export const login = (data) => apiClient.post('/api/v1/auth/login', data);
export const logout = () => apiClient.post('/api/v1/auth/logout');
export const getMe = () => apiClient.get('/api/v1/auth/me');
export const updateUser = (id, data) => apiClient.patch(`/api/v1/users/${id}`, data);
