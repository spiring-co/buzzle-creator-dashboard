
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
=======
import React, { useEffect } from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";

export default function Stepper({ activeStepIndex, steps, type, children }) {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: type === "horizontal" ? "row" : "column",
        }}
      >
        {steps.map(({ label, index }) => (
          <div
            style={{
              flexDirection: type === "horizontal" ? "column" : "row",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StepCircle
              type={type}
              children={type === "vertical" && children}
              stepsLength={steps.length}
              stepIndex={index}
              isActive={index === activeStepIndex}
              isDone={activeStepIndex > index}
            />
            <h4
              style={{
                position: "relative",
                left: type === "horizontal" ? -40 : 10,
                top: type === "horizontal" ? 10 : 5,
              }}
            >
              {label}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCircle({
  stepIndex,
  isActive,
  isDone,
  stepsLength,
  type,
  children,
}) {
  useEffect(() => {}, [isActive, isDone, children]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: type === "horizontal" ? "row" : "column",
      }}
    >
      <div
        style={{
          height: 40,
          width: 40,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 20,
          backgroundColor: isDone
            ? "rgb(10,132,255)"
            : isActive
            ? "rgb(10,132,255)"
            : "lightgrey",
        }}
      >
        <p style={{ fontSize: 25, color: "white", fontWeight: "bold" }}>
          {stepIndex + 1}
        </p>
      </div>
      {type === "vertical" && isActive ? (
        <div
          style={{
            position: "relative",
            padding: 50,
            minHeight: type === "horizontal" ? 5 : isActive ? "auto" : 50,
            margin: 5,

            minWidth: type === "horizontal" ? 150 : 5,
            borderBottom:
              type === "horizontal" &&
              (isDone ? "2px solid rgb(10,132,255)" : "2px solid grey"),

            borderLeft:
              type === "vertical" &&
              (isDone ? "2px solid rgb(10,132,255)" : "2px solid grey"),
            alignSelf: "center",
          }}
        >
          {type === "vertical" && children}
        </div>
      ) : (
        stepIndex !== stepsLength - 1 && (
          <div
            style={{
              minHeight: type === "horizontal" ? 5 : isActive ? "auto" : 50,
              margin: 5,

              minWidth: type === "horizontal" ? 150 : 5,
              borderBottom:
                type === "horizontal" &&
                (isDone ? "2px solid rgb(10,132,255)" : "2px solid grey"),

              borderLeft:
                type === "vertical" &&
                (isDone ? "2px solid rgb(10,132,255)" : "2px solid grey"),
              alignSelf: "center",
            }}
          ></div>
        )
      )}
    </div>
  );
}

