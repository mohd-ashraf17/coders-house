import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  redirect,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Navigation from "./components/shared/navigation/Navigation";
import Authenticate from "./pages/authenticate/Authenticate";
import Activate from "./pages/activate/Activate";
import Rooms from "./pages/rooms/Rooms";
import Room from "./pages/room/Room";
import MainLoader from "./components/shared/mainLoader/mainLoader";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";

const App = () => {
  const { loading } = useLoadingWithRefresh();
  return loading ? (
    <MainLoader message="Loading, Please wait..." />
  ) : (
    <Router>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<GuestRoute Component={Home} />}></Route>
        <Route
          path="/authenticate"
          element={<GuestRoute Component={Authenticate} />}
        ></Route>
        <Route
          path="/activate"
          element={<AuthenticRoute Component={Activate} />}
        ></Route>
        <Route
          path="/rooms"
          element={<AuthenticRoute Component={Rooms} />}
        ></Route>
        <Route
          path="/room/:id"
          element={<RoomRoute Component={Room} />}
        ></Route>
      </Routes>
    </Router>
  );
};

const GuestRoute = ({ Component }) => {
  const { isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/rooms");
    }
  }, [navigate, isAuth]);
  return <Component />;
};

const AuthenticRoute = ({ Component }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    } else if (isAuth && !user.activated) {
      navigate("/activate");
    } else {
      navigate("/rooms");
    }
  }, [navigate, isAuth, user]);
  return <Component />;
};

const RoomRoute = ({ Component }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuth && user.activated) {
      redirect("/room/:id");
    }
  }, [isAuth, user]);
  return <Component />;
};

export default App;
