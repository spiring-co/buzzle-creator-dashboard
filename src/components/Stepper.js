import React, { useState } from "react";
import "./Stepper.css";

function Stepper({ stepperDetails, setStepperDetails }) {
  const handleActive = (e, currentStep) => {
    let newstepperDetails = stepperDetails.map((step, i) => {
      if (step.count === currentStep.count) {
        return { ...step, active: true };
      }
      return step;
    });

    setStepperDetails(newstepperDetails);
  };

  return (
    <div className="container">
      <ul className="progressbar">
        {stepperDetails.map((step, index) => {
          return (
            <React.Fragment key={step.count}>
              <li
                id={index}
                name="list"
                className={step.active ? "active" : "null"}
                onChange={(e) => {
                  handleActive(e, step);
                }}
              >
                <input
                  style={{
                    position: "absolute",
                    top: "2px",
                    opacity: "0",
                    width: "44px",
                    height: "60px",
                  }}
                  name="new"
                  id={step.count}
                  type="radio"
                />
                <label name="lable">{step.title}</label>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
}

export default Stepper;
