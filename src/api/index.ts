import axios from 'axios';
import toast from 'react-hot-toast';

export const AXIOS = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

AXIOS.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data as any);
    }
    return Promise.reject(error);
  },
);

export const getFetcher = async (url: string) => {
  const res = await AXIOS.get(url);
  console.log({ res });
  return res.data;
};
