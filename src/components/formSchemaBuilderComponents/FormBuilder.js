import React, { useContext, useEffect, useState } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import SegmentDisplay from "./SegmentDisplay";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";
import FontUpload from "./FontUpload";
import AssetUpload from "./AssetUpload";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(true);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(1);
  const [compositions, setCompositions] = useState([]);

  useEffect(() => {
    if (edit) {
      loadVideo(video);
    } else {
      resetVideo();
    }
    setLoading(false);
  }, []);
  useEffect(() => {}, [activeDisplayIndex]);

  const handleSubmitForm = async () => {
    alert("Submiting");
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile = "" } = data;
    setCompositions(projectFile?.data ?? []);

    editVideoKeys({ tags, title, description });
    setActiveDisplayIndex(1);
  };

  const renderFormBuilder = (activeDisplayIndex) => {
    switch (activeDisplayIndex) {
      case 0:
        return (
          <VideoTemplateMetaForm
            restoredValues={edit ? videoObj : null}
            onSubmit={handleVideoTemplateMetaSubmit}
          />
        );
      case 1:
        return (
          <VersionDisplay
            edit={edit}
            compositions={{ main: {}, temp: {} }}
            activeDisplayIndex={activeDisplayIndex}
            setActiveDisplayIndex={setActiveDisplayIndex}
            handleSubmitForm={handleSubmitForm}
          />
        );
      case 2:
        return (
          <FontUpload
            setActiveDisplayIndex={setActiveDisplayIndex}
            activeDisplayIndex={activeDisplayIndex}
          />
        );
      case 3:
        return (
          <AssetUpload
            setActiveDisplayIndex={setActiveDisplayIndex}
            activeDisplayIndex={activeDisplayIndex}
          />
        );

      default:
        return;
    }
  };
  const renderStepper = (activeDisplayIndex) => {
    const steps = [
      `${edit ? "Edit" : "Add"} File Meta`,
      `${edit ? "Edit" : "Add"} Versions`,
      `${edit ? "Edit" : "Add"} Font Files`,
      `${edit ? "Edit" : "Add"} Assets Files`,
    ];
    return (
      <Stepper activeStep={activeDisplayIndex} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {renderStepper(activeDisplayIndex)}

      <Typography> {renderFormBuilder(activeDisplayIndex)}</Typography>
    </div>
  );
}

export default (props) => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};
