import React from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./Home.module.css";
import Card from "../../components/shared/card/Card";
import Button from "../../components/shared/button/Button";

const Home = () => {
  const signInLink = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };
  const history = useNavigate();
  const startRegister = () => {
    console.log("clicked");
    history("/authenticate");
  };
  return (
    <div className="cardRapper">
      <Card title="Welcome to Codershouse!" logo="logo">
        <p className={style.text}>
          We're working hard to get Codershouse ready for everyone! while we
          wrap up the finishing youches, we're adding people gradually to make
          sure nothing breaks
        </p>
        <div>
          <Button onClick={startRegister} text="Let's go" />
        </div>
      </Card>
    </div>
  );
};

export default Home;
