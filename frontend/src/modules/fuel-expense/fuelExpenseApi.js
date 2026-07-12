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
