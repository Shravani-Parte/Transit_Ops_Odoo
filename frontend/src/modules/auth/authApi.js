import apiClient from '../../services/apiClient';

export const authApi = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('transitops_token', response.access_token);
    localStorage.setItem('transitops_user', JSON.stringify(response.user));
    return response;
  },

  logout() {
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('transitops_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('transitops_token');
  },
};
