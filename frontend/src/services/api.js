const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API fetch helper with token handling and clean error formatting
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
      console.error(`Non-JSON response from server [${response.status}]:`, textResponse);
      throw new Error(`Server returned status ${response.status}. Please check backend server.`);
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
  
  // User Skill APIs
  getMySkills: (token) => request('/users/me/skills', 'GET', null, token),
  addTeachingSkill: (skillData, token) => request('/users/me/skills/teach', 'POST', skillData, token),
  addLearningSkill: (skillData, token) => request('/users/me/skills/learn', 'POST', skillData, token),
  updateTeachingSkill: (skillId, level, token) => request(`/users/me/skills/teach/${skillId}`, 'PUT', { level }, token),
  updateLearningSkill: (skillId, level, token) => request(`/users/me/skills/learn/${skillId}`, 'PUT', { level }, token),
  deleteTeachingSkill: (skillId, token) => request(`/users/me/skills/teach/${skillId}`, 'DELETE', null, token),
  deleteLearningSkill: (skillId, token) => request(`/users/me/skills/learn/${skillId}`, 'DELETE', null, token),
  
  // User Search & Public Profile
  searchUsers: (query = '') => request(`/users/search${query ? `?skill=${encodeURIComponent(query)}` : ''}`, 'GET'),
  getPublicProfile: (userId) => request(`/users/${userId}`, 'GET'),
};

export const skillAPI = {
  getAll: (params = {}) => {
    const queryParts = [];
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    return request(`/skills${queryString}`, 'GET');
  },
  getById: (id) => request(`/skills/${id}`, 'GET'),
  create: (skillData, token) => request('/skills', 'POST', skillData, token),
};

// Phase 3 Skill Matching APIs
export const matchAPI = {
  getMatches: (params = {}, token) => {
    const queryParts = [];
    if (params.minMatch) queryParts.push(`minMatch=${encodeURIComponent(params.minMatch)}`);
    if (params.matchType) queryParts.push(`matchType=${encodeURIComponent(params.matchType)}`);
    if (params.skill) queryParts.push(`skill=${encodeURIComponent(params.skill)}`);
    if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params.sortBy) queryParts.push(`sortBy=${encodeURIComponent(params.sortBy)}`);
    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    return request(`/matches${queryString}`, 'GET', null, token);
  },
  getMatchDetails: (userId, token) => request(`/matches/${userId}`, 'GET', null, token),
};

// Phase 3 Exchange Request APIs
export const exchangeAPI = {
  sendRequest: (requestData, token) => request('/exchange-requests', 'POST', requestData, token),
  getReceivedRequests: (token) => request('/exchange-requests/received', 'GET', null, token),
  getSentRequests: (token) => request('/exchange-requests/sent', 'GET', null, token),
  getPendingCount: (token) => request('/exchange-requests/pending-count', 'GET', null, token),
  acceptRequest: (id, token) => request(`/exchange-requests/${id}/accept`, 'PUT', null, token),
  rejectRequest: (id, token) => request(`/exchange-requests/${id}/reject`, 'PUT', null, token),
  cancelRequest: (id, token) => request(`/exchange-requests/${id}/cancel`, 'PUT', null, token),
  getActiveExchanges: (token) => request('/exchange-requests/active', 'GET', null, token),
};

export default {
  auth: authAPI,
  user: userAPI,
  skill: skillAPI,
  match: matchAPI,
  exchange: exchangeAPI,
};
