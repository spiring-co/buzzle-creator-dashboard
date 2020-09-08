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

export default ({ submitForm, isEdit, isDrafted = false, video }) => {
  const { user } = useAuth();
  const [videoObj] = useContext(VideoTemplateContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(false);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEdit || isDrafted) {
      loadVideo(video);
    } else {
      resetVideo(user?.id);
    }
  }, [isDrafted, isEdit]);

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
    console.log(staticAssets, staticAssets.map((a, index) =>
      video?.staticAssets.map(({ name }) => name).includes(a.name)
        ? video?.staticAssets[video?.staticAssets.map(({ name }) => name).indexOf(a.name)]
        : a));
    editVideoKeys({
      keywords, title, description, src: fileUrl, thumbnail, staticAssets: isEdit ? staticAssets.map((a, index) =>
        video?.staticAssets.map(({ name }) => name).includes(a.name)
          ? video?.staticAssets[video?.staticAssets.map(({ name }) => name).indexOf(a.name)]
          : a)
        : staticAssets
    });
    setActiveDisplayIndex(1);
  };

  const Steps = {
    VideoTemplateMetaForm: (
      <VideoTemplateMetaForm
        isEdit={(isEdit || isDrafted)}
        assets={videoObj.staticAssets}
        compositions={compositions}
        initialValues={
          (isEdit || isDrafted)
            ? { ...video, projectFile: video?.src ?? "" }
            : { ...videoObj, projectFile: videoObj?.src ?? "" }
        }
        onSubmit={handleVideoTemplateMetaSubmit}
      />
    ),
    VersionDisplay: (
      <VersionDisplay
        isEdit={isEdit || isDrafted}
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
        staticAssets={videoObj?.staticAssets}
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
