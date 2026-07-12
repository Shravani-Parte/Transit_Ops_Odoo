
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const tripsApi = {
  list: (params) => axiosClient.get(ENDPOINTS.trips, { params }).then((r) => r.data),
  get: (id) => axiosClient.get(`${ENDPOINTS.trips}/${id}`).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.trips, data).then((r) => r.data),
  update: (id, data) => axiosClient.put(`${ENDPOINTS.trips}/${id}`, data).then((r) => r.data),
  dispatch: (id) => axiosClient.post(`${ENDPOINTS.trips}/${id}/dispatch`).then((r) => r.data),
  complete: (id, data) => axiosClient.post(`${ENDPOINTS.trips}/${id}/complete`, data).then((r) => r.data),
  cancel: (id) => axiosClient.post(`${ENDPOINTS.trips}/${id}/cancel`).then((r) => r.data),
};

