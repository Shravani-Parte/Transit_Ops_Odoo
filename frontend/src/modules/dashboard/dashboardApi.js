import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const dashboardApi = {
  getKpis: (params) => axiosClient.get(ENDPOINTS.dashboard, { params }).then((r) => r.data),
};
