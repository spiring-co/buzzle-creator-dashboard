import {
  Button, ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary, Typography, Paper
} from "@material-ui/core";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import { ExpandMore, ArrowForward, ArrowBack } from "@material-ui/icons";
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

    setActiveVersionIndex(videoObj.versions.length);

  }, []);

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
    <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
      <ExpansionPanel
        defaultExpanded={true}
        style={{ marginBottom: 20, }}
      >
        <ExpansionPanelSummary

          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Typography>
            <strong>
              Versions</strong>
          </Typography>

        </ExpansionPanelSummary>

        <ExpansionPanelDetails style={{ flexWrap: 'wrap' }} >
          {videoObj.versions.length === 0 ? <div>
            <Typography style={{ color: 'grey' }}>No Version Added.</Typography>
          </div> : videoObj?.versions?.map((item, index) => {
            if (index === activeVersionIndex) {
              return <div></div>;
            }

            if (index === editIndex) {
              return <div></div>;
            }
            return (
              <Paper style={{ padding: 10, margin: 10 }}>
                <Typography><strong>Title: </strong>{item.title}</Typography>
                <Typography><strong>Description: </strong>{item.description}</Typography>
                <Typography><strong>No of fields: </strong>{item.editableLayers.length}</Typography>
                <Button
                  size="small"
                  style={{ margin: 8 }}
                  variant="contained"
                  color="primary"
                  onClick={() => openVersionMeta(index, true)} children="Edit" />

                <Button
                  size="small"
                  style={{ margin: 8 }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setActiveVersionIndex(activeVersionIndex - 1)
                    removeVersion(index)
                  }} children="Delete" /></Paper>

            );
          })}
        </ExpansionPanelDetails>
      </ExpansionPanel>

      <Paper><VersionStepper activeStep={activeStep} renderStep={renderStep} /></Paper>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          style={{ margin: 10 }}
          color="primary"
          variant="outlined"

          onClick={() =>
            activeDisplayIndex === 2
              ? setActiveDisplayIndex(1)
              : setActiveDisplayIndex(0)
          }
          disabled={!activeDisplayIndex === 2 && !activeDisplayIndex === 1}
        >
          Back
        </Button>

        <Button
          endIcon={<ArrowForward />}
          style={{ margin: 10 }}
          color="primary"
          variant="contained"
          disabled={videoObj.versions.length === 0}
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
        >
          Next
      </Button></div>
    </div>
  );
};
