import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import SegmentDisplay from "./SegmentDisplay";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Typography from "@material-ui/core/Typography";
import VersionMeta from "./VersionMeta";
export default ({
  edit,
  compositions,
  activeDisplayIndex,

  setActiveDisplayIndex,
}) => {
  const [videoObj] = useContext(SegmentsContext);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editVersion, setEditVersion] = useState(false);
  const { addVersion, removeVersion } = useActions();
  const [activeStep, setActiveStep] = useState(0);
  const [comp_name, setComp_name] = useState("");

  useEffect(() => {
    if (edit) {
      setActiveVersionIndex(videoObj.versions.length);
    }
  }, []);
  useEffect(() => {}, [activeStep]);

  const openVersionMeta = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      addVersion({ comp_name });
    }
    setActiveStep(activeStep + 1);
  };

  const openSegmentBuilder = () => {
    setActiveStep(activeStep + 1);
  };

  const openVersionDisplay = () => {
    console.log(videoObj);
    setEditVersion(false);
    setEditIndex(null);
    setActiveStep(0);
    setComp_name("");
  };
  const renderStep = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Group as={Row}>
              <Col sm="7">
                <Form.Control
                  as="select"
                  value={comp_name}
                  onChange={(e) => setComp_name(e.target.value)}
                >
                  <option disabled selected value="">
                    Select Composition
                  </option>
                  {Object.keys(compositions).map((item, index) => {
                    return (
                      <option key={index} id={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
              <Col sm="3">
                <Button
                  // style={{ float: "right" }}
                  variant="outline-primary"
                  onClick={() => openVersionMeta()}
                  disabled={comp_name === ""}
                >
                  Add
                </Button>
              </Col>
            </Form.Group>
          </Form>
        );
      case 1:
        return (
          <VersionMeta
            activeVersionIndex={editVersion ? editIndex : activeVersionIndex}
            openSegmentBuilder={openSegmentBuilder}
          />
        );
      case 2:
        return (
          <SegmentDisplay
            edit={edit}
            editVersion={editVersion}
            compositions={compositions}
            activeVersionIndex={editVersion ? editIndex : activeVersionIndex}
            setActiveVersionIndex={setActiveVersionIndex}
            openVersionDisplay={openVersionDisplay}
          />
        );
      default:
        return;
    }
  };
  const renderVersionStepper = (activeStep) => {
    const steps = [
      `${editVersion ? "Edit" : "Add"} Version`,
      `${editVersion ? "Edit" : "Add"} Version Meta`,
      `${editVersion ? "Edit" : "Add"} Segment`,
    ];
    return (
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{renderStep(activeStep)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: 50 }}>
      {videoObj?.versions.map((item, index) => {
        if (index === activeVersionIndex) {
          return <div></div>;
        }

        if (index === editIndex) {
          return <div></div>;
        }
        return (
          <div style={{ border: "1px solid black", padding: 10, margin: 10 }}>
            <p style={{ fontSize: 15 }}>{JSON.stringify(item)}</p>
            <button onClick={() => openVersionMeta(index, true)}>Edit</button>
            <span> </span>
            <button onClick={() => removeVersion(index)}>Delete</button>
          </div>
        );
      })}
      {renderVersionStepper(activeStep)}
      <br />
      {edit && (
        <Button
          variant="outline-primary"
          style={{ float: "left", marginRight: "2%" }}
          onClick={() =>
            activeDisplayIndex === 2
              ? setActiveDisplayIndex(1)
              : setActiveDisplayIndex(0)
          }
          disabled={!activeDisplayIndex === 2 && !activeDisplayIndex === 1}
        >
          Back
        </Button>
      )}
      <Button
        style={{ float: "left" }}
        variant="outline-primary"
        disabled={videoObj.versions.length === 0}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
      >
        Next
      </Button>
    </div>
  );
};

{
  /* <div style={{ textAlign: "center" }}>
      <p>{edit ? "View Versions" : "Create Versions"}</p>

      {videoObj?.versions.map((item, index) => {
        return (
          <div style={{ border: "1px solid black", padding: 10, margin: 10 }}>
            <p style={{ fontSize: 15 }}>{JSON.stringify(item)}</p>
            <button onClick={() => openVersionMeta(index, true)}>
              Edit
            </button>
            <span> </span>
            <button onClick={() => removeVersion(index)}>Delete</button>
          </div>
        );
      })}
      {!edit && (
        <div style={{ margin: 10 }}>
          <select onChange={(e) => setComp_name(e.target.value)}>
            <option disabled selected value="">
              Select Composition
            </option>
            {Object.keys(compositions).map((item, index) => {
              return (
                <option key={index} id={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => openVersionMeta()}
            disabled={comp_name === ""}
          >
            Add
          </button>
        </div>
      )}
      <br />
      <button
        onClick={() =>
          activeDisplayIndex === 2
            ? setActiveDisplayIndex(1)
            : setActiveDisplayIndex(0)
        }
        disabled={!activeDisplayIndex === 2 && !activeDisplayIndex === 1}
      >
        Back
      </button>
      <button
        disabled={videoObj.versions.length === 0}
        onClick={handleSubmitForm}
      >
        {edit ? "Save Edits" : "Submit Form"}
      </button>
    </div> */
}
