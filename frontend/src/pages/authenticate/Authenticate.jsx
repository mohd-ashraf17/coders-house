import { useState } from "react";
import StepPhoneEmail from "../steps/stepPhoneEmail/StepPhoneEmail";
import StepOTP from "../steps/stepOTP/StepOTP";

const Steps = {
  1: StepPhoneEmail,
  2: StepOTP,
};
const Authenticate = () => {
  const [step, setStep] = useState(1);
  const Step = Steps[step];

  const onNext = () => {
    setStep(step + 1);
  };

  return (
    <div>
      <Step onClick={onNext} />
    </div>
  );
};

export default Authenticate;
