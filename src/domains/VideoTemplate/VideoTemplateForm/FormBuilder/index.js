import React, { useContext, useState, useEffect } from "react";
import { Paper, Container } from "@material-ui/core";

import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";

import SnackAlert from "common/SnackAlert";

import AssetUpload from "./AssetUpload";
import FontUpload from "./FontUpload";
import FormStepper from "./FormStepper";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

import { useAuth } from "services/auth";

export default ({ submitForm, isEdit, isDrafted = false, video, type }) => {
  const { user } = useAuth();
  const [videoObj] = useContext(VideoTemplateContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(false);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);
  const [error, setError] = useState(null);


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
    // console.log(
    //   staticAssets,
    //   staticAssets.map((a, index) =>
    //     video?.staticAssets.map(({ name }) => name).includes(a.name)
    //       ? video?.staticAssets[
    //           video?.staticAssets.map(({ name }) => name).indexOf(a.name)
    //         ]
    //       : a
    //   )
    // );
    editVideoKeys({
      ...((isEdit || isDrafted) ? {} : { type }),
      keywords,
      title,
      description,
      src: fileUrl,
      thumbnail,
      staticAssets: isEdit
        ? staticAssets.map((a, index) =>
          video?.staticAssets.map(({ name }) => name).includes(a.name)
            ? video?.staticAssets[
            video?.staticAssets.map(({ name }) => name).indexOf(a.name)
            ]
            : a
        )
        : staticAssets,
    });
    setActiveDisplayIndex(1);
  };

  const Steps = {
    VideoTemplateMetaForm: (
      <VideoTemplateMetaForm
        type={(isEdit || isDrafted) ? video?.type : type}
        isEdit={isEdit || isDrafted}
        assets={videoObj.staticAssets}
        compositions={compositions}
        initialValues={
          isEdit || isDrafted
            ? { ...video, projectFile: video?.src ?? "" }
            : { ...videoObj, projectFile: videoObj?.src ?? "" }
        }
        onSubmit={handleVideoTemplateMetaSubmit}
      />
    ),
    VersionDisplay: (
      <VersionDisplay
        type={(isEdit || isDrafted) ? video?.type : type}
        isEdit={isEdit || isDrafted}
        compositions={compositions}
        activeDisplayIndex={activeDisplayIndex}
        setActiveDisplayIndex={setActiveDisplayIndex}
        isSubmitting={loading}
        handleSubmitForm={handleSubmitForm}
        submitError={error}
      />
    ),
    ...(((isEdit || isDrafted) ? video?.type : type) === 'ae' ? {
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
          handleSubmitForm={handleSubmitForm}
          submitError={error}
          setActiveDisplayIndex={setActiveDisplayIndex}
          activeDisplayIndex={activeDisplayIndex}
          staticAssets={videoObj?.staticAssets}
        />
      ),
    } : {})
  };
  useEffect(() => {
    if (isEdit || isDrafted) {
      loadVideo(video);
    } else {
      resetVideo(user?.id, type);
    }
  }, [isDrafted, isEdit]);
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
      <FormStepper type={(isEdit || isDrafted) ? video?.type : type} activeDisplayIndex={activeDisplayIndex} />
      <Paper elevation={2} style={{ padding: 32 }}>
        {Steps[Object.keys(Steps)[activeDisplayIndex]]}
      </Paper>
    </Container>
  );
};
