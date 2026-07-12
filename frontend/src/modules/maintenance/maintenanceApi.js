import axiosClient from '../../api/axiosClient';

export async function listMaintenance({ status, page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/maintenance', { params });
  return response.data;
}

export async function openMaintenance(data) {
  const response = await axiosClient.post('/maintenance', data);
  return response.data;
}

export async function closeMaintenance(id, data) {
  const response = await axiosClient.post(`/maintenance/${id}/close`, data);
  return response.data;
}
