import { authApi } from '../modules/auth/authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('transitops_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      authApi.logout();
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

const apiClient = {
  get(endpoint) {
    return request(endpoint, { method: 'GET' });
  },
  post(endpoint, data) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  put(endpoint, data) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  patch(endpoint, data) {
    return request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' });
  },
};

export default apiClient;
