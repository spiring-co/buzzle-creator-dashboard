import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import SegmentDisplay from "./SegmentDisplay";
import VersionStepper from "./VersionStepper";
import CompositionPicker from "./CompositionPicker";
import VersionMeta from "./VersionMeta";
export default ({
  isEdit,
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
    if (isEdit) {
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
          <CompositionPicker
            comp_name={comp_name}
            setComp_name={setComp_name}
            compositions={compositions}
            openVersionMeta={openVersionMeta}
          />
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
            isEdit={isEdit}
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
            <button onClick={() => openVersionMeta(index, true)}>isEdit</button>
            <span> </span>
            <button onClick={() => removeVersion(index)}>Delete</button>
          </div>
        );
      })}
      <VersionStepper activeStep={activeStep} renderStep={renderStep} />
      <br />
      {isEdit && (
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
      <p>{isEdit ? "View Versions" : "Create Versions"}</p>

      {videoObj?.versions.map((item, index) => {
        return (
          <div style={{ border: "1px solid black", padding: 10, margin: 10 }}>
            <p style={{ fontSize: 15 }}>{JSON.stringify(item)}</p>
            <button onClick={() => openVersionMeta(index, true)}>
              isEdit
            </button>
            <span> </span>
            <button onClick={() => removeVersion(index)}>Delete</button>
          </div>
        );
      })}
      {!isEdit && (
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
        {isEdit ? "Save Edits" : "Submit Form"}
      </button>
    </div> */
}
