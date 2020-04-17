import React, { useContext, useEffect, useState } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import SegmentDisplay from "./SegmentDisplay";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);

  const { resetVideo, editVideoKeys, loadVideo } = useActions();

  const [editVersion, setEditVersion] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
  const [compositions, setCompositions] = useState([]);

  useEffect(() => {
    edit ? loadVideo(video) : resetVideo();
  }, []);
  useEffect(() => {}, [activeDisplayIndex]);

  const openVersionDisplay = () => {
    setEditVersion(false);
    setEditIndex(0);
    setActiveDisplayIndex(1);
  };

  const handleTagsChange = (e) => {
    var tags = e.target.value.split(",");
    editVideoKeys({ tags });
  };

  const handleSubmitForm = async () => {
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile } = data;

    setCompositions(projectFile.data);
    setEditVersion(false);
    setEditIndex(0);
    setActiveDisplayIndex(1);
    editVideoKeys({ tags, title, description });
  };

  const renderFormBuilder = (activeDisplayIndex) => {
    switch (activeDisplayIndex) {
      case 0:
        return (
          <VideoTemplateMetaForm onSubmit={handleVideoTemplateMetaSubmit} />
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
  return renderFormBuilder(activeDisplayIndex);
}

export default (props) => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};
