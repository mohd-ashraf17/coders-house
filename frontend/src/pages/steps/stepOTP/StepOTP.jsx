import React, { useState } from "react";
import Card from "../../../components/shared/card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import Button from "../../../components/shared/button/Button";
import style from "./OTP.module.css";
import { verifyOtp } from "../../../http";
import { useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const StepOTP = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState("");
  const { email, hash } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();

  const submit = async () => {
    if (!otp) {
      return;
    }
    const { data } = await verifyOtp({ email, hash, otp});
    // console.log(data)
    localStorage.setItem('refreshToken', data.newRefreshToken);
    localStorage.setItem('accessToken', data.newAccesToken);
    dispatch(setAuth(data));
    navigate("/activate")
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
