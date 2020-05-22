import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";

import AssetUpload from "./AssetUpload";
import FontUpload from "./FontUpload";
import FormStepper from "./FormStepper";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

export default ({ submitForm, isEdit, video }) => {
  const [videoObj] = useContext(SegmentsContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(true);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);

  useEffect(() => {
    if (isEdit) {
      loadVideo(video);
    } else {
      resetVideo();
    }
    setLoading(false);
  }, []);

  useEffect(() => {}, [activeDisplayIndex]);

  const handleSubmitForm = async () => {
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile = "" } = data;

    setCompositions(projectFile?.data ?? []);

    editVideoKeys({ tags, title, description, fileUrl: projectFile.fileUrl });
    setActiveDisplayIndex(1);
  };

  const Steps = {
    VideoTemplateMetaForm: (
      <VideoTemplateMetaForm
        restoredValues={isEdit ? videoObj : null}
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
        setActiveDisplayIndex={setActiveDisplayIndex}
        activeDisplayIndex={activeDisplayIndex}
        handleSubmitForm={handleSubmitForm}
      />
    ),
  };

  if (loading) return <p>Loading...</p>;

  return (
    <StateProvider>
      <FormStepper activeDisplayIndex={activeDisplayIndex} />
      {Steps[Object.keys(Steps)[activeDisplayIndex]]}
    </StateProvider>
  );
};
