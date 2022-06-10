import axios from "axios";

export const AXIOS = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

export const getFetcher = async (url: string) => {
  const res = await AXIOS.get(url);
  console.log({ res });
  return res.data
};
