import axiosClient from '../../api/axiosClient';

export async function vehicleROI() {
  const response = await axiosClient.get('/reports/roi');
  return response.data;
}

export async function fuelEfficiency() {
  const response = await axiosClient.get('/reports/fuel-efficiency');
  return response.data;
}

export async function utilizationSeries() {
  const response = await axiosClient.get('/reports/utilization');
  return response.data;
}

export async function operationalCostSeries() {
  const response = await axiosClient.get('/reports/cost');
  return response.data;
}

export async function monthlyRevenue() {
  const response = await axiosClient.get('/reports/revenue');
  return response.data;
}
