import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';

export async function login(email, password) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.login, { email, password });
  return data;
}

export async function getMe() {
  const { data } = await axiosClient.get(ENDPOINTS.auth.me);
  return data;
}
