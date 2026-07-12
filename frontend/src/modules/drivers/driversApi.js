<<<<<<< HEAD
import axiosClient from '../../api/axiosClient';

export async function listDrivers({ q, status, page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/drivers', { params });
  return response.data;
}

export async function getDriver(id) {
  const response = await axiosClient.get(`/drivers/${id}`);
  return response.data;
}

export async function driverHistory(id) {
  const response = await axiosClient.get(`/drivers/${id}/status-history`);
  return response.data;
}

export async function createDriver(data) {
  const response = await axiosClient.post('/drivers', data);
  return response.data;
}

export async function updateDriver(id, patch) {
  const response = await axiosClient.patch(`/drivers/${id}`, patch);
  return response.data;
}

export async function suspendDriver(id) {
  const response = await axiosClient.patch(`/drivers/${id}/suspend`);
  return response.data;
}

export async function reinstateDriver(id) {
  const response = await axiosClient.patch(`/drivers/${id}/reinstate`);
  return response.data;
}

export async function deleteDriver(id) {
  await axiosClient.delete(`/drivers/${id}`);
}
=======

import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const driversApi = {
  list: (params) => axiosClient.get(ENDPOINTS.drivers, { params }).then((r) => r.data),
  get: (id) => axiosClient.get(`${ENDPOINTS.drivers}/${id}`).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.drivers, data).then((r) => r.data),
  update: (id, data) => axiosClient.put(`${ENDPOINTS.drivers}/${id}`, data).then((r) => r.data),
  delete: (id) => axiosClient.delete(`${ENDPOINTS.drivers}/${id}`),
  history: (id) => axiosClient.get(`${ENDPOINTS.drivers}/${id}/status-history`).then((r) => r.data),
};

>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
