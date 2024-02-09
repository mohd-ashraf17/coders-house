import { useState } from "react";
import StepName from "../steps/stepName/StepName";
import StepAvatar from "../steps/stepAvatar/StepAvatar";

const Steps = {
  1: StepName,
  2: StepAvatar,
};
const Activate = () => {
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

export default Activate;
