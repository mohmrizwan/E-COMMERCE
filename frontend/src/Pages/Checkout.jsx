import React, { useState } from "react";
import Address from "../Components/Checkout.jsx/Address";
import Payment from "../Components/Checkout.jsx/Payment";

const Checkout = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && <Address setStep={setStep} />}

      {step === 2 && <Payment setStep={setStep} />}

      {step === 3 && (
        <div>
          <h1>Order Accepted</h1>
        </div>
      )}
    </>
  );
};

export default Checkout;