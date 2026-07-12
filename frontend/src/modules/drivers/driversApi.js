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
