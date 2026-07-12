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
}
