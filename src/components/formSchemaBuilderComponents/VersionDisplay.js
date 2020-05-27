import { Button, } from "@material-ui/core";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";

import CompositionPicker from "./CompositionPicker";
import LayerAdder from "./LayerAdder";
import VersionMeta from "./VersionMeta";
import VersionStepper from "./VersionStepper";

export default ({
  isEdit,
  compositions,
  activeDisplayIndex,
  setActiveDisplayIndex,
}) => {

  const [videoObj] = useContext(VideoTemplateContext);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editVersion, setEditVersion] = useState(false);
  const { addVersion, removeVersion, editversionKeys } = useActions();
  const [activeStep, setActiveStep] = useState(0);
  const [composition, setCompoisition] = useState("");

  useEffect(() => {
    if (isEdit) {
      setActiveVersionIndex(videoObj.versions.length);
    }
  }, []);
  useEffect(() => { }, [activeStep]);

  const openVersionMeta = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      addVersion({ composition });
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
    setCompoisition("");
  };

  const renderStep = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <CompositionPicker
            composition={composition}
            setCompoisition={setCompoisition}
            compositions={compositions}
            openVersionMeta={openVersionMeta}
          />
        );
      case 1:
        return (
          <VersionMeta
            onSubmit={(data) => {
              editversionKeys(editVersion ? editIndex : activeVersionIndex, {
                title: data.title,
                description: data.description
              });
              openSegmentBuilder()
            }
            }
            initialValue={editVersion &&
            {
              title: videoObj?.versions[editIndex]?.title,
              description: videoObj?.versions[editIndex]?.description
            }}
          />
        );
      case 2:
        return (
          <LayerAdder
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
            <button onClick={() => {
              setActiveVersionIndex(activeVersionIndex - 1)
              removeVersion(index)
            }}>Delete</button>
          </div>
        );
      })}
      <VersionStepper activeStep={activeStep} renderStep={renderStep} />
      <br />
      {isEdit && (
        <Button
          color="primary"
          variant="outlined"
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

        color="primary"
        variant="outlined"
        disabled={videoObj.versions.length === 0}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
      >
        Next
      </Button>
    </div>
  );
};
