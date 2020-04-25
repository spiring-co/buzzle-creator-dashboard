import React, { useEffect } from "react";
import { Button, Col, Form, Row, Container } from "react-bootstrap";

export default function Stepper({ activeStepIndex, steps, type }) {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {steps.map(({ label, index }) => (
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <StepCircle
              stepsLength={steps.length}
              stepIndex={index}
              isActive={index === activeStepIndex}
              isDone={activeStepIndex > index}
            />
            <h4>{label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCircle({ stepIndex, isActive, isDone, stepsLength }) {
  useEffect(() => {}, [isActive, isDone]);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
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
      {stepIndex !== stepsLength - 1 && (
        <div
          style={{
            height: 5,
            minWidth: 250,
            backgroundColor: isDone ? "rgb(10,132,255)" : "grey",
            alignSelf: "center",
          }}
        ></div>
      )}
    </div>
  );
}
