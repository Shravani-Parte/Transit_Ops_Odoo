
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const maintenanceApi = {
  list: (params) => axiosClient.get(ENDPOINTS.maintenance, { params }).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.maintenance, data).then((r) => r.data),
  close: (id) => axiosClient.post(`${ENDPOINTS.maintenance}/${id}/close`).then((r) => r.data),
};
