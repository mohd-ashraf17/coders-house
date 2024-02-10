import axios from "axios";

const api = axios.create({
  // withCredentials: true,
  baseURL: "https://coders-house.vercel.app",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// axios.defaults.withCredentials = true;

// all endpoint
export const sendOtp = (data) =>
  api.post("https://coders-house.vercel.app/api/send-otp", data);
export const verifyOtp = (data) =>
  api.post("https://coders-house.vercel.app/api/verify-otp", data);
export const activate = (data) =>
  api.post("https://coders-house.vercel.app/api/activate", data);
export const logout = (data) =>
  api.post("https://coders-house.vercel.app/api/logout", data);
export const createRoom = (data) =>
  api.post("https://coders-house.vercel.app/api/room", data);
export const getAllRooms = (data) =>
  api.post("https://coders-house.vercel.app/api/rooms", data);
export const getRoom = (roomId, data) =>
  api.post(`https://coders-house.vercel.app/api/rooms/${roomId}`, data);

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
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        await axios.post("https://coders-house.vercel.app/api/refresh", {
          refreshToken,
          accessToken,
        });
        localStorage.setItem("refreshToken", data.newRefreshToken);
        localStorage.setItem("accessToken", data.newAccesToken);
        return api.request(originalRequest);
      } catch (err) {
        console.log(err);
      }
    }
    throw error;
  }
);
export default api;
