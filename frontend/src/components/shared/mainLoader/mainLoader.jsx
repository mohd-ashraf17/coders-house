import React from "react";
import style from "./mainLoader.module.css";
import Card from "../card/Card";

const mainLoader = ({ message }) => {
  return (
    <>
      <div className="cardRapper">
        <Card>
          <div>Loading...</div>
          <h2 className={style.message}>{message}</h2>
        </Card>
      </div>
    </>
  );
};

export default mainLoader;
