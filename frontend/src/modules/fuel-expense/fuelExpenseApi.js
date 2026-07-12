<<<<<<< HEAD
import axiosClient from '../../api/axiosClient';

export async function listFuel({ page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/fuel-logs', { params });
  return response.data;
}

export async function listExpenses({ category, page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/expenses', { params });
  return response.data;
}

export async function createFuel(data) {
  const response = await axiosClient.post('/fuel-logs', data);
  return response.data;
}

export async function createExpense(data) {
  const response = await axiosClient.post('/expenses', data);
  return response.data;
}
=======

import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/endpoints';

export const fuelExpenseApi = {
  listFuelLogs: (params) => axiosClient.get(ENDPOINTS.fuelLogs, { params }).then((r) => r.data),
  createFuelLog: (data) => axiosClient.post(ENDPOINTS.fuelLogs, data).then((r) => r.data),
  listExpenses: (params) => axiosClient.get(ENDPOINTS.expenses, { params }).then((r) => r.data),
  createExpense: (data) => axiosClient.post(ENDPOINTS.expenses, data).then((r) => r.data),
};
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
