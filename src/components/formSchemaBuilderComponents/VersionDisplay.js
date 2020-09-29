import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Box,
  Paper,
} from "@material-ui/core";
import useActions from "contextStore/actions";
import Alert from '@material-ui/lab/Alert';
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import { ExpandMore, ArrowForward, ArrowBack } from "@material-ui/icons";
import CompositionPicker from "./CompositionPicker";
import LayerAdder from "./LayerAdder";
import VersionMeta from "./VersionMeta";
import VersionStepper from "./VersionStepper";
import VersionSampleField from "./VersionSampleField";
import { getLayersFromComposition } from "services/helper";
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
  const { removeVersion, editversionKeys } = useActions();
  const [activeStep, setActiveStep] = useState(0);
  const [composition, setComposition] = useState("");
  const [isVersionValid, setIsVersionValid] = useState(videoObj?.versions?.map(({ fields, composition }) => {
    const extracted = getLayersFromComposition(compositions[composition])
    const compLayer = Object.keys(extracted)?.flatMap(k => extracted[k]?.map(({ name }) => name))
    return fields?.map(({ rendererData: { layerName } }) => layerName).every(layer => compLayer.includes(layer))
  }))
  const [isVersionsFieldsDuplicate, setIsVersionsFieldsDuplicate] = useState(videoObj?.versions?.map(({ fields }) => {
    const layerWithProperty = fields?.map(({ rendererData: { layerName, property } }) => layerName + property)
    if (new Set(layerWithProperty)?.size !== layerWithProperty.length) {
      return true
    }
    else return false
  }))
  useEffect(() => {
    setIsVersionValid(videoObj?.versions?.map(({ fields, composition }) => {
      const extracted = getLayersFromComposition(compositions[composition])
      const compLayer = Object.keys(extracted)?.flatMap(k => extracted[k]?.map(({ name }) => name))
      return fields?.map(({ rendererData: { layerName } }) => layerName).every(layer => compLayer.includes(layer))
    }))
    setIsVersionsFieldsDuplicate(videoObj?.versions?.map(({ fields }) => {
      const layerWithProperty = fields?.map(({ rendererData: { layerName, property } }) => layerName + property)
      console.log(new Set(layerWithProperty)?.size, layerWithProperty.length)
      if (new Set(layerWithProperty)?.size !== layerWithProperty.length) {
        return true
      }
      else return false
    }))
  }, [videoObj])

  useEffect(() => {
    setActiveVersionIndex(videoObj.versions.length);
  }, [activeVersionIndex]);

  const handleCancel = () => {
    if (editVersion) {
      openVersionDisplay();
    } else {
      removeVersion(activeVersionIndex);
      openVersionDisplay();
    }
  };

  const openVersionMeta = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      editversionKeys(editVersion ? editIndex : activeVersionIndex, {
        composition,
      });
    }
    setActiveStep(activeStep + 1);
  };

  const openVersionDisplay = () => {
    setEditVersion(false);
    setEditIndex(null);
    setActiveStep(0);
    setComposition("");
  };

  const renderStep = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <CompositionPicker
            composition={composition}
            setComposition={setComposition}
            compositions={compositions}
            openVersionMeta={openVersionMeta}
          />
        );
      case 1:
        return (
          <VersionMeta
            onBack={() => {
              setComposition(
                videoObj?.versions[editVersion ? editIndex : activeVersionIndex]
                  ?.composition
              );
              setActiveStep(activeStep - 1);
            }}
            onSubmit={(data) => {
              editversionKeys(editVersion ? editIndex : activeVersionIndex, {
                title: data.title,
                description: data.description,
              });
              setActiveStep(activeStep + 1);
            }}
            initialValue={{
              title:
                videoObj?.versions[editVersion ? editIndex : activeVersionIndex]
                  ?.title,
              description:
                videoObj?.versions[editVersion ? editIndex : activeVersionIndex]
                  ?.description,
            }}
          />
        );
      case 2:
        return (
          <LayerAdder
            onBack={() => setActiveStep(activeStep - 1)}
            isEdit={isEdit}
            editVersion={editVersion}
            compositions={compositions}
            activeVersionIndex={editVersion ? editIndex : activeVersionIndex}
            setActiveVersionIndex={setActiveVersionIndex}
            onSubmit={() => setActiveStep(activeStep + 1)}
          />
        );
      case 3:
        return (
          <VersionSampleField
            onBack={() => setActiveStep(activeStep - 1)}
            onClick={() => console.log(videoObj)}
            isEdit={isEdit}
            editVersion={editVersion}
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
    <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
      <ExpansionPanel defaultExpanded={true} style={{ marginBottom: 20 }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header">
          <Typography variant="h5">Versions</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails style={{ flexWrap: "wrap" }}>
          {videoObj.versions.length === 0 ? (
            <div>
              <Typography style={{ color: "grey" }}>
                No Version Added.
              </Typography>
            </div>
          ) : (
              videoObj?.versions?.map((item, index) => {
                if (index === activeVersionIndex) {
                  return <div></div>;
                }

                if (index === editIndex) {
                  return <div></div>;
                }
                return (
                  <Paper key={index} style={{ padding: 10, margin: 10 }}>
                    <Typography>
                      <strong>Title: </strong>
                      {item.title}
                    </Typography>
                    <Typography>
                      <strong>Description: </strong>
                      {item.description}
                    </Typography>
                    <Typography>
                      <strong>No of fields: </strong>
                      {item.fields.length}
                    </Typography>
                    <Button
                      size="small"
                      disabled={activeStep !== 0}
                      style={{ margin: 8 }}
                      variant="contained"
                      color="primary"
                      onClick={() => openVersionMeta(index, true)}
                      children="Edit"
                    />

                    <Button
                      disabled={activeStep !== 0}
                      size="small"
                      style={{ margin: 8 }}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setActiveVersionIndex(activeVersionIndex - 1);
                        removeVersion(index);
                      }}
                      children="Delete"
                    />
                    {!isVersionValid[index] && <Alert severity="warning">Layers Not Found!</Alert>}
                    {isVersionsFieldsDuplicate[index] && <Alert severity="warning">Contains Duplicate Fields!</Alert>}
                  </Paper>
                );
              })
            )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {activeStep !== 0 && (
        <Button
          onClick={handleCancel}
          style={{ justifyContent: "flex-start", width: "fit-content" }}
          variant="outlined"
          color="secondary">
          Discard
        </Button>
      )}
      <VersionStepper activeStep={activeStep} renderStep={renderStep} />
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>

        <Button
          disabled={videoObj.versions.length === 0 || activeStep !== 0 || !isVersionValid?.every(v => v) || !isVersionsFieldsDuplicate?.every(v => !v)}
          endIcon={<ArrowForward />}
          color="primary"
          variant="contained"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}>
          Next
        </Button>
      </Box>
    </div>
  );
};
