import axiosClient from '../../api/axiosClient';
<<<<<<< HEAD

export async function listVehicles({ q, status, type, region, page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size });
  const response = await axiosClient.get('/vehicles', { params });
  return response.data;
}

export async function getVehicle(id) {
  const response = await axiosClient.get(`/vehicles/${id}`);
  return response.data;
}

export async function statusHistory(vehicleId) {
  const response = await axiosClient.get(`/vehicles/${vehicleId}/status-history`);
  return response.data;
}

export async function createVehicle(data) {
  const response = await axiosClient.post('/vehicles', data);
  return response.data;
}

export async function updateVehicle(id, patch) {
  const response = await axiosClient.patch(`/vehicles/${id}`, patch);
  return response.data;
}

export async function deleteVehicle(id) {
  await axiosClient.delete(`/vehicles/${id}`);
}
=======
import { ENDPOINTS } from '../../api/endpoints';

export const vehiclesApi = {
  list: (params = {}) => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params)
        .filter(([_, value]) => value !== '' && value != null)
        .map(([key, value]) => {
          if (key === 'region_id') {
            const num = parseInt(value);
            return [key, isNaN(num) ? undefined : num];
          }
          return [key, value];
        })
        .filter(([_, value]) => value != null)
    );
    return axiosClient.get(ENDPOINTS.vehicles, { params: cleanedParams }).then((r) => r.data);
  },
  get: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}`).then((r) => r.data),
  create: (data) => axiosClient.post(ENDPOINTS.vehicles, data).then((r) => r.data),
  update: (id, data) => axiosClient.put(`${ENDPOINTS.vehicles}/${id}`, data).then((r) => r.data),
  delete: (id) => axiosClient.delete(`${ENDPOINTS.vehicles}/${id}`),
  history: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}/status-history`).then((r) => r.data),
  retire: (id) => axiosClient.post(`${ENDPOINTS.vehicles}/${id}/retire`).then((r) => r.data),
  documents: {
    list: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}/documents`).then((r) => r.data),
    create: (id, data) => axiosClient.post(`${ENDPOINTS.vehicles}/${id}/documents`, data).then((r) => r.data),
    delete: (vehicleId, documentId) => axiosClient.delete(`${ENDPOINTS.vehicles}/${vehicleId}/documents/${documentId}`),
  },
  costSummary: (id) => axiosClient.get(`${ENDPOINTS.vehicles}/${id}/cost-summary`).then((r) => r.data),
};
>>>>>>> e21946685e62ae18c3f3933d86dd20bdbac55cd8
