import React, { useState } from "react";
import Card from "../../../components/shared/card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/button/Button";
import style from "./OTP.module.css";
import { verifyOtp } from "../../../http";
import { useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useDispatch } from "react-redux";

const StepOTP = () => {
  const [otp, setOtp] = useState("");
  const { email, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  const submit = async () => {
    if (!otp) {
      return;
    }
    const { data } = await verifyOtp({ email, hash, otp});
    console.log(data)
    dispatch(setAuth(data));
  };
  return (
    <>
      <div className="cardRapper">
        <Card title="Enter the code we just texted you" logo="lock-emoji">
          <TextInput
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <div>
            <Button onClick={submit} text="Next" />
          </div>
        </Card>
      </div>
    </>
  );
};

export default StepOTP;
