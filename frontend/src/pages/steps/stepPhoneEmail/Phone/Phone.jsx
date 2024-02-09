import { useState } from "react";
import Card from "../../../../components/shared/card/Card";
import Button from "../../../../components/shared/button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import style from "./Phone.module.css";
import { setOtp } from "../../../../store/authSlice";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/shared/loader/Loader";

const Phone = ({ onNext }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const submit = async () => {
    if (!phone) {
      return;
    }
    setLoading(true);
  };
  const [phone, setPhone] = useState("");

  return loading ? (
    <Loader message="This service currently not working..." />
  ) : (
    <Card title="Enter your phone number" logo="phone">
      <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className={style.buttonRapper}>
        <Button onClick={submit} text="Next" />
      </div>
      <p className={style.paragraph}>
        By entering your number, you're agreeing to our Terms of Service and
        Privacy Policy. Thanks!
      </p>
    </Card>
  );
};

export default Phone;
