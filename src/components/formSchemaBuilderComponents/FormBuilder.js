import React, { useContext, useState, useEffect } from "react";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";

import SnackAlert from "components/SnackAlert";
import AssetUpload from "./AssetUpload";
import FontUpload from "./FontUpload";
import FormStepper from "./FormStepper";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";
import { Paper, Container } from "@material-ui/core";
import { useAuth } from "services/auth";

export default ({ submitForm, isEdit, video }) => {
  const { user } = useAuth();

  const [videoObj] = useContext(VideoTemplateContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(false);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (isEdit) {
      loadVideo(video);
    } else {
      resetVideo(user?.id);
    }
  }, []);

  const handleSubmitForm = async () => {
    try {
      setError(null);
      setLoading(true);
      await submitForm(videoObj);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err);
    }
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const {
      keywords,
      title,
      description,
      thumbnail,
      projectFile: { fileUrl = "", staticAssets = [], compositions = [] },
    } = data;
    setCompositions(compositions);
    console.log(compositions);
    setAssets(isEdit ? video?.staticAssets : staticAssets);
    editVideoKeys({ keywords, title, description, src: fileUrl, thumbnail });
    setActiveDisplayIndex(1);
  };

  const Steps = {
    VideoTemplateMetaForm: (
      <VideoTemplateMetaForm
        isEdit={isEdit}
        assets={assets}
        compositions={compositions}
        initialValues={
          isEdit
            ? { ...video, projectFile: video.src }
            : { ...videoObj, projectFile: videoObj?.src ?? "" }
        }
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
        staticAssets={
          videoObj?.staticAssets.length !== 0 ? videoObj?.staticAssets : assets
        }
      />
    ),
  };

  return (
    <Container>
      <SnackAlert
        message={
          error?.message ?? "Oop's, something went wrong, action failed !"
        }
        open={error}
        onClose={() => {
          setError(false);
        }}
        type={"error"}
      />
      <FormStepper activeDisplayIndex={activeDisplayIndex} />
      <Paper elevation={2} style={{ padding: 32 }}>
        {Steps[Object.keys(Steps)[activeDisplayIndex]]}
      </Paper>
    </Container>
  );
};
