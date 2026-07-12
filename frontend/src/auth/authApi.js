<<<<<<< HEAD
/** Real auth API */
import axiosClient from '../api/axiosClient';

export async function login(email, password) {
  const response = await axiosClient.post('/auth/login', { email, password });
  const token = response.data.access_token;
  
  // Get user info
  const meResponse = await axiosClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return {
    ...meResponse.data,
    token
  };
}

export async function register(name, email, password, roleName = 'FleetManager') {
  const response = await axiosClient.post('/auth/register', { name, email, password, role_name: roleName });
  const token = response.data.access_token;
  
  // Get user info
  const meResponse = await axiosClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return {
    ...meResponse.data,
    token
  };
}

export async function logout() {
  await axiosClient.post('/auth/logout');
=======
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

export async function login(email, password) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.login, { email, password });
  return data;
}

export async function getMe() {
  const { data } = await axiosClient.get(ENDPOINTS.auth.me);
  return data;
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
}
