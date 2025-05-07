import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const $api = axios.create({
  baseURL: import.meta.env.VITE_TARGET,
});

let accessToken = "";

export function setAccessToken(newToken: string): void {
  accessToken = newToken;
}

$api.interceptors.request.use(
  (config: AdaptAxiosRequestConfig): AdaptAxiosRequestConfig => {
    config.withCredentials = true;

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }
);

export default $api;
