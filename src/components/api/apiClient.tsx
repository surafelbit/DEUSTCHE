import axios from "axios";
const apiClient = axios.create({
  baseURL:
    // "https://deutschemedizin-collage-backend-production.up.railway.app/api",

    "https://growing-crayfish-firstly.ngrok-free.app/api",
  headers: {
    // Global header to bypass Ngrok browser warning which can cause 403
    "ngrok-skip-browser-warning": "true",
  },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("xy9a7b");
  if (token && config.headers.requiresAuth !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default apiClient;
