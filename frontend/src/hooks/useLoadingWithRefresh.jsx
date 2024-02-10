import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export const useLoadingWithRefresh = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        const accessToken = localStorage.getItem("accessToken")
        const { data } = await axios.get("https://coders-house.vercel.app/api/refresh", { refreshToken, accessToken });
        dispatch(setAuth(data));
        localStorage.setItem("refreshToken", data.newRefreshToken)
        localStorage.setItem("accessToken", data.newAccesToken)
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    })();
  }, []);
  return { loading };
};
