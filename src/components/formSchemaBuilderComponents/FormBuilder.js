import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useState, useEffect } from "react";

import SnackAlert from "components/SnackAlert";
import AssetUpload from "./AssetUpload";
import FontUpload from "./FontUpload";
import FormStepper from "./FormStepper";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";
import { Paper } from "@material-ui/core";

export default ({ submitForm, isEdit, video }) => {
  const [videoObj] = useContext(VideoTemplateContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(false);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEdit) {
      loadVideo(video);
    } else {
      resetVideo();
    }
  }, []);

  const handleSubmitForm = async () => {
    try {
      setError(null)
      setLoading(true)
      await submitForm(videoObj);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile = "" } = data;

    setCompositions(projectFile?.data ?? []);

    editVideoKeys({ tags, title, description, src: projectFile.fileUrl });
    setActiveDisplayIndex(1);
  };

  const Steps = {
    VideoTemplateMetaForm: (
      <VideoTemplateMetaForm
        initialValues={isEdit ? video : {}}
        onSubmit={handleVideoTemplateMetaSubmit}
      />
    ),
    VersionDisplay: (
      <VersionDisplay
        isEdit={isEdit}
        compositions={compositions}
        activeDisplayIndex={activeDisplayIndex}
        setActiveDisplayIndex={setActiveDisplayIndex}
      />
    ),
    FontUpload: (
      <FontUpload
        compositions={compositions}
        setActiveDisplayIndex={setActiveDisplayIndex}
        activeDisplayIndex={activeDisplayIndex}
      />
    ),
    AssetUpload: (
      <AssetUpload
        isSubmitting={loading}
        submitError={error}
        setActiveDisplayIndex={setActiveDisplayIndex}
        activeDisplayIndex={activeDisplayIndex}
        handleSubmitForm={handleSubmitForm}
      />
    ),
  };

  return (
    <>
      <SnackAlert
        message={error?.message ?? "Oop's, something went wrong, action failed !"}
        open={error}
        onClose={() => {
          setError(false)
        }}
        type={"error"} />
      <FormStepper activeDisplayIndex={activeDisplayIndex} />
      <Paper elevation={2} style={{ padding: 32 }}>
        {Steps[Object.keys(Steps)[activeDisplayIndex]]}
      </Paper>
    </>
  );
};
