import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";

export default ({ activeStep, editVersion, renderStep }) => {
  const steps = [
    `${editVersion ? "Edit" : "Add"} Version`,
    `${editVersion ? "Edit" : "Add"} Version Meta`,
    `${editVersion ? "Edit" : "Add"} Fields`,
    `${editVersion ? "Edit" : "Add"} Sample Video`
  ];
  return (
    <Stepper activeStep={activeStep} orientation="vertical">
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
          <StepContent>{renderStep(activeStep)}</StepContent>
        </Step>
      ))}
    </Stepper>
  );
};
