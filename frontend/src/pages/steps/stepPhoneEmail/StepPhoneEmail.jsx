import { useState } from "react";
import Phone from "./Phone/Phone";
import Email from "./Email/Email";
import style from "./StepPhoneEmail.module.css";

const PhoneEmailMap = {
  Phone: Phone,
  Email: Email,
};
const StepPhoneEmail = ({ onClick }) => {
  const [type, setType] = useState("Email");
  const Component = PhoneEmailMap[type];
  return (
    <>
      <div className="cardRapper">
        <div>
          <div className={style.buttonRapper}>
            <button
              className={`${style.button} ${
                type === "Phone" ? style.active : ""
              }`}
              onClick={() => {
                setType("Phone");
              }}
            >
              <img src="/images/phone-white.png" alt="" />
            </button>
            <button
              className={`${style.button} ${
                type === "Email" ? style.active : ""
              }`}
              onClick={() => {
                setType("Email");
              }}
            >
              <img src="/images/mail-white.png" alt="" />
            </button>
          </div>
          <Component onNext={onClick} />
        </div>
      </div>
    </>
  );
};

export default StepPhoneEmail;
