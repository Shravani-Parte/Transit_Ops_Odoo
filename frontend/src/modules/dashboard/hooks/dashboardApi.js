import apiClient from '../../../services/apiClient';

export const dashboardApi = {
  async getKpis(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return apiClient.get(`/dashboard/kpis?${params}`);
  },
};
