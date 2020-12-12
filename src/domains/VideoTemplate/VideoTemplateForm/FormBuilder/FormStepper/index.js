import React from "react";

import Step from "@material-ui/core/Step";
import Stepper from "@material-ui/core/Stepper";
import StepLabel from "@material-ui/core/StepLabel";

export default ({ activeDisplayIndex }) => {
  const steps = [`File Meta`, `Versions`, `Font Files`, `Assets Files`];
  return (
    <Stepper
      style={{ background: "transparent" }}
      activeStep={activeDisplayIndex}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            style={{
              fontWeight: 700,
            }}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
