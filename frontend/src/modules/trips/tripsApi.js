import axiosClient from '../../api/axiosClient'

export async function listTrips({ q, status, page = 1, size = 20 } = {}) {
    const params = new URLSearchParams({ page, size });
    const response = await axiosClient.get('/trips', { params });
    return response.data;
}

export async function getTrip(id) {
    const response = await axiosClient.get(`/trips/${id}`);
    return response.data;
}

export async function createDraft(data) {
    const response = await axiosClient.post('/trips', data);
    return response.data;
}

export async function dispatchTrip(id) {
    const response = await axiosClient.post(`/trips/${id}/dispatch`);
    return response.data;
}

export async function completeTrip(id, data) {
    const response = await axiosClient.post(`/trips/${id}/complete`, data);
    return response.data;
}

export async function cancelTrip(id) {
    const response = await axiosClient.post(`/trips/${id}/cancel`);
    return response.data;
}

export async function availableVehicles() {
    // TODO: Implement API for this
    const response = await axiosClient.get('/vehicles');
    return (response.data?.items || []).filter(v => v.status === 'Available');
}

export async function eligibleDrivers() {
    // TODO: Implement API for this
    const response = await axiosClient.get('/drivers');
    return (response.data?.items || []).filter(d => d.status === 'Available');
}

export async function validateCargoWithinCapacity(vehicleId, cargoWeight) {
    // TODO: Implement API for this
    const response = await axiosClient.get(`/vehicles/${vehicleId}`);
    const vehicle = response.data;
    if (!vehicle) return { ok: false, reason: 'Vehicle not found' };
    if (Number(cargoWeight) > Number(vehicle.max_load_capacity)) {
        return { ok: false, reason: `Cargo ${cargoWeight}kg exceeds capacity ${vehicle.max_load_capacity}kg` };
    }
    return { ok: true };
}
