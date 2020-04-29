import React, { useContext, useEffect, useState } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";
import FontUpload from "./FontUpload";
import AssetUpload from "./AssetUpload";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(true);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(2);
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
    console.log(projectFile);
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
            compositions={compositions}
            activeDisplayIndex={activeDisplayIndex}
            setActiveDisplayIndex={setActiveDisplayIndex}
          />
        );
      case 2:
        return (
          <FontUpload
            compositions={compositions}
            setActiveDisplayIndex={setActiveDisplayIndex}
            activeDisplayIndex={activeDisplayIndex}
          />
        );
      case 3:
        return (
          <AssetUpload
            setActiveDisplayIndex={setActiveDisplayIndex}
            activeDisplayIndex={activeDisplayIndex}
            handleSubmitForm={handleSubmitForm}
          />
        );

      default:
        return;
    }
  };
  const renderStepper = (activeDisplayIndex) => {
    const steps = [`File Meta`, `Versions`, `Font Files`, `Assets Files`];
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

      {renderFormBuilder(activeDisplayIndex)}
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
