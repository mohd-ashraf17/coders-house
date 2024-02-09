import React, { useState } from "react";
import Card from "../../../components/shared/card/Card";
import Button from "../../../components/shared/button/Button";
import style from "./StepAvatar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { setAuth } from "../../../store/authSlice";
import { activate } from "../../../http";
import Loader from "../../../components/shared/loader/Loader";

const StepAvatar = () => {
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/monkey-avatar.png");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };
  const submit = async () => {
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      if (data.user) {
        dispatch(setAuth(data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <Loader message="Activation in progress..." />
  ) : (
    <>
      <div className="cardRapper">
        <Card title={`Okey. ${name}`} logo="monkey-emoji">
          <p className={style.subHeading}>How's this photo?</p>
          <div className={style.imageWrapper}>
            <img className={style.avatar} src={image} alt="avatar" />
          </div>
          <div>
            <input
              className={style.input}
              type="file"
              id="image"
              onChange={captureImage}
            />
            <label className={style.label} htmlFor="image">
              Choose a diffrent photo
            </label>
          </div>
          <div className={style.buttonRapper}>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepAvatar;
