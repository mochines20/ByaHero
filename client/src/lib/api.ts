import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true,
});

let csrfTokenCache: string | null = null;
let csrfTokenRequest: Promise<string> | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;
  if (csrfTokenRequest) return csrfTokenRequest;

  csrfTokenRequest = api.get("/csrf-token").then((res) => {
    const token = String(res.data?.csrfToken ?? "");
    csrfTokenCache = token;
    csrfTokenRequest = null;
    return token;
  }).catch((err) => {
    csrfTokenRequest = null;
    throw err;
  });

  return csrfTokenRequest;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method ?? "get").toLowerCase();
  const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

  if (needsCsrf) {
    const token = await getCsrfToken();
    config.headers = config.headers ?? {};
    config.headers["x-csrf-token"] = token;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error?.response?.data?.message ?? "Request failed";
    return Promise.reject(new Error(msg));
  }
);
