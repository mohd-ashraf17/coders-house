import { useState } from "react";
import Card from "../../../../components/shared/card/Card";
import Button from "../../../../components/shared/button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import style from "./Email.module.css";
import { setOtp } from "../../../../store/authSlice";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../../../http";
import Loader from "../../../../components/shared/loader/Loader";

const Email = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const submit = async () => {
    if (!email) {
      return;
    }
    // server request
    setLoading(true);
    const { data } = await sendOtp({ email });
    // console.log(data)
    if (data) {
      setLoading(false);
    }
    dispatch(setOtp({ email, hash: data.hash }));
    onNext();
  };
  return loading ? (
    <Loader message="OTP sent in progress..." />
  ) : (
    <Card title="Enter your Email id" logo="email-emoji">
      <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className={style.buttonRapper}>
        <Button onClick={submit} text="Next" />
      </div>
      <p className={style.paragraph}>
        By entering your email, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
};

export default Email;
