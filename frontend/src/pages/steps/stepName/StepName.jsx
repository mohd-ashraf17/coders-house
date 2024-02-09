import React, { useState } from "react";
import Card from "../../../components/shared/card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/button/Button";
import style from "./StepName.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";

const StepName = ({ onClick }) => {
  const { name } = useSelector((state) => state.activate);
  const [names, setNames] = useState(name);
  const dispatch = useDispatch();

  const submit = () => {
    if (!names) {
      return;
    }
    dispatch(setName(names));
    onClick();
  };
  return (
    <>
      <div className="cardRapper">
        <Card title="What's your full name?" logo="goggle-emoji">
          <TextInput
            value={names}
            onChange={(e) => {
              setNames(e.target.value);
            }}
          />
          <p className={style.paragraph}>
            People use real names at codershouse: !
          </p>
          <div className={style.buttonRapper}>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepName;
