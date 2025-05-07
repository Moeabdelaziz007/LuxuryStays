import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler function
const handleApiError = (error: AxiosError) => {
  const toast = useToast;

  // Extract error message
  let errorMessage = 'An error occurred while processing your request.';
  
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    const data = error.response.data as any;
    errorMessage = data.message || data.error || errorMessage;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from server. Please check your connection.';
  } else {
    // Something happened in setting up the request
    errorMessage = error.message || errorMessage;
  }

  // Default error handling
  console.error('API Error:', errorMessage, error);
  
  // Return structured error for components to handle
  return {
    error: true,
    status: error.response?.status,
    message: errorMessage,
    original: error,
  };
};

// API Client for making HTTP requests
export const ApiClient = {
  /**
   * Make a GET request
   * @param url - The URL to send the request to
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  /**
   * Make a POST request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  /**
   * Make a PUT request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  /**
   * Make a PATCH request
   * @param url - The URL to send the request to
   * @param data - The data to send in the request body
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  /**
   * Make a DELETE request
   * @param url - The URL to send the request to
   * @param config - Optional axios request configuration
   * @returns Promise with the response data
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage or your auth context
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors globally
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      console.warn('Authentication error. Please login again.');
      
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default ApiClient;