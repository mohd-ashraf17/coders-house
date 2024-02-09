import React from "react";
import style from "./Card.module.css";

const Card = ({ title, logo, children }) => {
  return (
    <div className={style.card}>
      <div className={style.headingRapper}>
        {logo && <img src={`/images/${logo}.png`} alt="logo" />}
        {title && <h1 className={style.heading}>{title}</h1>}
      </div>
      {children}
    </div>
  );
};

export default Card;
