import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";

export default ({ activeStep, renderStep }) => {
    const steps = [
        `Render Time`,
        `Loyalty Curreny`,
        `Loyalty Amount`,
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
