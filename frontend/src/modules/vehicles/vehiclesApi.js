import axiosClient from '../../api/axiosClient';

export async function listVehicles({ q, status, type, region, page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/vehicles', { params });
  return response.data;
}

export async function getVehicle(id) {
  const response = await axiosClient.get(`/vehicles/${id}`);
  return response.data;
}

export async function statusHistory(vehicleId) {
  const response = await axiosClient.get(`/vehicles/${vehicleId}/status-history`);
  return response.data;
}

export async function createVehicle(data) {
  const response = await axiosClient.post('/vehicles', data);
  return response.data;
}

export async function updateVehicle(id, patch) {
  const response = await axiosClient.patch(`/vehicles/${id}`, patch);
  return response.data;
}

export async function deleteVehicle(id) {
  await axiosClient.delete(`/vehicles/${id}`);
}
