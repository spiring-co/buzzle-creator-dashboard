import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";

import SegmentDisplay from "./SegmentDisplay";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);

  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(true);
  const [editVersion, setEditVersion] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
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

  const openVersionDisplay = () => {
    setEditVersion(false);
    setEditIndex(0);
    setActiveDisplayIndex(1);
  };

  const handleSubmitForm = async () => {
    alert("Submiting");
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile = "" } = data;
    setCompositions(projectFile?.data ?? []);
    setEditVersion(false);
    setEditIndex(0);
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
            setEditIndex={setEditIndex}
            setEditVersion={setEditVersion}
            compositions={compositions}
            activeDisplayIndex={activeDisplayIndex}
            setActiveDisplayIndex={setActiveDisplayIndex}
            handleSubmitForm={handleSubmitForm}
          />
        );

      case 2:
        return (
          <SegmentDisplay
            edit={edit}
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
  if (loading) return <p>Loading...</p>;
  return renderFormBuilder(activeDisplayIndex);
}

export default (props) => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};
