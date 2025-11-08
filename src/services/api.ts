import axios from 'axios';
import { SearchResponse, Scientist } from '../types/scientist';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging (optional)
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const scientistService = {
  // Get paginated list of scientists
  getScientists: async (params: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
  } = {}): Promise<SearchResponse> => {
    const response = await api.get('/scientists', { params });
    return response.data;
  },

  // Get specific scientist by ID
  getScientist: async (scientistId: string): Promise<Scientist> => {
    const response = await api.get(`/scientists/${scientistId}`);
    return response.data;
  },

  // Search scientists by name or accomplishments
  searchScientists: async (params: {
    q: string;
    page?: number;
    per_page?: number;
  }): Promise<SearchResponse> => {
    const response = await api.get('/scientists/search', { params });
    return response.data;
  },

  // Get scientists by year range
  getScientistsByYear: async (params: {
    birth_year_min?: number;
    birth_year_max?: number;
    death_year_min?: number;
    death_year_max?: number;
    page?: number;
    per_page?: number;
  }): Promise<SearchResponse> => {
    const response = await api.get('/scientists/by-year', { params });
    return response.data;
  },

  // Get database statistics
  getStats: async (): Promise<any> => {
    const response = await api.get('/stats');
    return response.data;
  },

  // Get random scientists for quiz
  getRandomScientists: async (count: number = 10): Promise<SearchResponse> => {
    // Since there's no random endpoint, we'll get scientists and shuffle them
    const response = await api.get('/scientists', {
      params: { per_page: count * 2 } // Get more than needed to ensure variety
    });
    
    // Shuffle the array
    const shuffled = [...response.data.scientists].sort(() => Math.random() - 0.5);
    
    return {
      ...response.data,
      scientists: shuffled.slice(0, count)
    };
  }
};

export default api;