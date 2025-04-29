import axios from 'axios';
import { AxiosService } from '@/services/clientAxiosService';

const BASE_API_URL = process.env.API_URL;

export const api = new AxiosService(
  axios.create({
    baseURL: BASE_API_URL,
  }),
);

api.client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage;

    if (error?.response?.data?.message) {
      errorMessage = {
        message: error.response.data.message,
      };
    }

    return Promise.reject(errorMessage || error);
  },
);
