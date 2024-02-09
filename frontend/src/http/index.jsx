import axios from "axios";

const api = axios.create({
  // withCredentials: true,
  baseURL: 'https://coders-house.vercel.app',
  headers: {
    'Access-Control-Allow-Origin': '*',
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  credentials: 'same-origin',
});
// axios.defaults.withCredentials = true;

// all endpoint
export const sendOtp = (data) => api.post("https://coders-house.vercel.app/api/send-otp", data);
export const verifyOtp = (data) => api.post("https://coders-house.vercel.app/api/verify-otp", data);
export const activate = (data) => api.post("https://coders-house.vercel.app/api/activate", data);
export const logout = () => api.post("https://coders-house.vercel.app/api/logout");
export const createRoom = (data) => api.post("https://coders-house.vercel.app/api/rooms", data);
export const getAllRooms = () => api.get("https://coders-house.vercel.app/api/rooms");
export const getRoom = (roomId) => api.get(`https://coders-house.vercel.app/api/rooms/${roomId}`);

// intersapters
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest.isRetry = true;
      try {
        await axios.get("https://coders-house.vercel.app/api/refresh");
        return api.request(originalRequest);
      } catch (err) {
        console.log(err);
      }
    }
    throw error;
  }
);
export default api;
