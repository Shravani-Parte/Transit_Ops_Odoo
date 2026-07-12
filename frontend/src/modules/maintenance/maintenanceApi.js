<<<<<<< HEAD
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
=======

import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const maintenanceApi = {
  list: (params) => axiosClient.get(ENDPOINTS.maintenance, { params }).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.maintenance, data).then((r) => r.data),
  close: (id) => axiosClient.post(`${ENDPOINTS.maintenance}/${id}/close`).then((r) => r.data),
};
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
