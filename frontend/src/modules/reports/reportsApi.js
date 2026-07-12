
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const reportsApi = {
  getFuelEfficiency: () => axiosClient.get(ENDPOINTS.reports.fuelEfficiency).then((r) => r.data),
  getOperationalCost: () => axiosClient.get(ENDPOINTS.reports.operationalCost).then((r) => r.data),
  getVehicleRoi: () => axiosClient.get(ENDPOINTS.reports.roi).then((r) => r.data),
  getMonthlyRevenue: () => axiosClient.get(ENDPOINTS.reports.monthlyRevenue).then((r) => r.data),
  exportReport: (type, format) => 
    axiosClient.get(ENDPOINTS.reports.export(type), { 
      params: { format }, 
      responseType: 'blob' 
    }).then((r) => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }),
};
