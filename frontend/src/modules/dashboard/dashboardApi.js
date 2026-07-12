/** Real dashboard API */
import axiosClient from '../../api/axiosClient';

export async function getDashboardKpis() {
  const response = await axiosClient.get('/dashboard/kpis');
  return response.data;
}

export async function getDashboardFilters() {
  const response = await axiosClient.get('/dashboard/filters');
  return response.data;
}

export async function getFuelCostSeries() {
  // TODO: Implement real API for this
  return [];
}

export async function getUtilizationSeries() {
  // TODO: Implement real API for this
  return [];
}
