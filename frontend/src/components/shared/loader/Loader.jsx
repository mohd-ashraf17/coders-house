import React from "react";
import Card from "../card/Card";
import style from "./Loader.module.css";

const Loader = ({ message }) => {
  return (
    <>
      <div className={style.cardRappe}>
        <Card>
          <h2 className={style.message}>{message}</h2>
        </Card>
      </div>
    </>
  );
};

export default Loader;
