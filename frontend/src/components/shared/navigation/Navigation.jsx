import React from "react";
import { Link } from "react-router-dom";
import style from "./Navigation.module.css";
import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const navStyle = {
    color: "#fff",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "18px",
  };
  const logoText = {
    marginLeft: "10px",
  };
  const logoutUser = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const accessToken = localStorage.getItem('accessToken')
      const { data } = await logout({ refreshToken, accessToken });
      // localStorage.setItem('refreshToken', data.newRefreshToken)
      // localStorage.setItem('accessToken', data.newAccesToken)
      localStorage.clear('refreshToken')
      localStorage.clear('accessToken')
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav className={`${style.navbar} container`}>
      <Link style={navStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Codershouse</span>
      </Link>
      {isAuth && (
        <div className={style.navRight}>
          <h2>{user?.name}</h2>
          <Link to="/">
            <img
              className={style.avatar}
              src={user.avatar ? user.avatar : "/images/monkey-avatar.png"}
              height="40"
              width="40"
              alt="avatar"
            />
          </Link>
          <button className={style.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" alt="" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
