
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const reportsApi = {
  getFuelEfficiency: () => axiosClient.get(ENDPOINTS.reports.fuelEfficiency).then((r) => r.data),
  getOperationalCost: () => axiosClient.get(ENDPOINTS.reports.operationalCost).then((r) => r.data),
  getVehicleRoi: () => axiosClient.get(ENDPOINTS.reports.roi).then((r) => r.data),
  getMonthlyRevenue: () => axiosClient.get(ENDPOINTS.reports.monthlyRevenue).then((r) => r.data),
  exportCsv: (type) => axiosClient.get(ENDPOINTS.reports.export(type), { responseType: 'blob' }),
};
