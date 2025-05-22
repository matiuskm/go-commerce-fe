import axios from 'axios';
import BASE_URL from './config';

const instance = axios.create({
  baseURL: `${BASE_URL}`, // Ganti sesuai backend lo
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
