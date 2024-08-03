import axios from "axios";

const apiUrl = "/choreo-apis/statify/app/v1";

const defaultAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

const streamingAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
  responseType: "stream",
});

export { defaultAPI, streamingAPI };
