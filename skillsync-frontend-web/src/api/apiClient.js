import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * - Created a base axios instance with a predefined baseURL.
- Added a request interceptor to attach the JWT access token from localStorage.
- Added a response interceptor to handle 401 (Unauthorized) errors.
- Implemented a 'retry' mechanism: if a 401 occurs, the app attempts to 
  refresh the token via the /auth/refresh endpoint using HTTP-only cookies.
- Added automatic redirect to /login if the refresh token is expired or invalid.



**/
