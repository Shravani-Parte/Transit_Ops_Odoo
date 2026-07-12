
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

