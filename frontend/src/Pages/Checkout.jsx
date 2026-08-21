import React, { useState } from "react";
import Address from "../Components/Checkout.jsx/Address";
import Payment from "../Components/Checkout.jsx/Payment";
import Confirmation from "../Components/Checkout.jsx/Confirmation";

const Checkout = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <Address setStep={setStep} />}

      {step === 2 && <Payment setStep={setStep} />}

      {step === 3 &&  <Confirmation setStep={setStep} />}
    </>
  );
};

export default Checkout;