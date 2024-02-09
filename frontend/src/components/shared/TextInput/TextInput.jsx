import React from "react";
import style from "./TextInput.module.css";

const TextInput = (props) => {
  return (
    <input
      className={style.textInput}
      style={{ width: props.fullweidth === "true" ? "100%" : "" }}
      {...props}
      type="text"
    />
  );
};

export default TextInput;
