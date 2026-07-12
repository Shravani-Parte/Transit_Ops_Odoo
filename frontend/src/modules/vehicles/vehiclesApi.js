import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const vehiclesApi = {
  list: (params) => axiosClient.get(ENDPOINTS.vehicles, { params }).then((r) => r.data),
  get: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}`).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.vehicles, data).then((r) => r.data),
  update: (id, data) => axiosClient.put(`${ENDPOINTS.vehicles}/${id}`, data).then((r) => r.data),
  delete: (id) => axiosClient.delete(`${ENDPOINTS.vehicles}/${id}`),
  history: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}/status-history`).then((r) => r.data),
};
