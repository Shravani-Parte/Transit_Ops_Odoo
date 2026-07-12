
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const regionsApi = {
  list: () => axiosClient.get(ENDPOINTS.regions).then((r) => r.data),
};
