const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API fetch helper with token handling and robust error parsing
 */
const request = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const textResponse = await response.text();
      throw new Error(textResponse || `Server returned status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error.message);
    throw error;
  }
};

export const authAPI = {
  register: (userData) => request('/auth/register', 'POST', userData),
  login: (credentials) => request('/auth/login', 'POST', credentials),
  logout: () => request('/auth/logout', 'POST'),
  getMe: (token) => request('/auth/me', 'GET', null, token),
};

export const userAPI = {
  getProfile: (token) => request('/users/profile', 'GET', null, token),
  updateProfile: (profileData, token) => request('/users/profile', 'PUT', profileData, token),
};

export default {
  auth: authAPI,
  user: userAPI,
};
