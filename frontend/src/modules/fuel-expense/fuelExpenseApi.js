
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const fuelExpenseApi = {
  listFuelLogs: (params) => axiosClient.get(ENDPOINTS.fuelLogs, { params }).then((r) => r.data),
  createFuelLog: (data) => axiosClient.post(ENDPOINTS.fuelLogs, data).then((r) => r.data),
  listExpenses: (params) => axiosClient.get(ENDPOINTS.expenses, { params }).then((r) => r.data),
  createExpense: (data) => axiosClient.post(ENDPOINTS.expenses, data).then((r) => r.data),
};
