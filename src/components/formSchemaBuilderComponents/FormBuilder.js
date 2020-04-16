import FormBuilderSegment from "components/formSchemaBuilderComponents/FormBuilderSegment";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import VersionSummary from "./VersionSummary";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

const MAX_SEGMENT_COUNT = 5;

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);

  const {
    addSegment,
    resetVideo,
    editversionKeys,
    editVideoKeys,
    addVersion,
    removeVersion,
    loadVideo,
    removeSegment,
  } = useActions();
  const [editVersion, setEditVersion] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usedFields, setUsedFields] = useState([]);
  const [segmentDisplay, setSegmentDisplay] = useState(false);
  const [versionDisplay, setVersionDisplay] = useState(false);
  const [compositions, setCompositions] = useState([]);
  const [comp_name, setComp_name] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    edit ? loadVideo(video) : resetVideo();
  }, []);

  const _addSegment = () => {
    addSegment(activeVersionIndex);
    setActiveIndex(activeIndex + 1);
  };
  const openVersionDisplay = () => {
    setEditVersion(false);
    setEditIndex(0);
    setActiveIndex(0);
    setComp_name("");
    setUsedFields([]);
    setSegmentDisplay(false);
    setVersionDisplay(true);
  };
  const openSegmentsBuilder = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      addVersion({ comp_name });
    }
    setVersionDisplay(false);
    setSegmentDisplay(true);
  };

  const deleteSegment = () => {
    const fields = videoObj.versions[activeVersionIndex].form.segments[
      activeIndex
    ].fields.map((i) => i.name);
    setUsedFields(usedFields.filter((i) => !fields.includes(i)));
    activeIndex !== 0 && goToPreviousSegment();
    removeSegment(activeVersionIndex, activeIndex);
  };

  const handleTagsChange = (e) => {
    var tags = e.target.value.split(",");
    editVideoKeys({ tags });
  };
  const goToPreviousSegment = () => {
    setActiveIndex(activeIndex - 1);
  };
  const goToNextSegment = () => {
    setActiveIndex(activeIndex + 1);
  };

  const handleSubmitForm = async () => {
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
    const { tags, title, description, projectFile } = data;
    // setTextLayers([]);
    // setImageLayers([]);
    setCompositions(Object.keys(projectFile.data));
    setEditVersion(false);
    setEditIndex(0);
    setActiveIndex(0);
    setComp_name("");
    setUsedFields([]);
    setSegmentDisplay(false);
    setVersionDisplay(true);
    editVideoKeys({ tags, title, description });
  };

  if (segmentDisplay) {
    return (
      <Form>
        <p>
          <strong>
            {edit ? "Edit Version Details" : "Add Version Details"}
          </strong>
        </p>
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              title: e.target.value,
            });
          }}
          placeholder="Enter Version Title"
          type="text"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .title
          }
        />
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              description: e.target.value,
            });
          }}
          placeholder="Enter Version Description"
          type="text"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .description
          }
        />
        <Form.Control
          onChange={(e) => {
            setValue(Math.random());
            editversionKeys(editVersion ? editIndex : activeVersionIndex, {
              price: e.target.value,
            });
          }}
          placeholder="Enter Version Price"
          type="number"
          value={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex]
              .price
          }
        />
        <p>
          <strong>{edit ? "Edit Segments" : "Add Segments"}</strong>
        </p>
        <Button
          onClick={_addSegment}
          disabled={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length > MAX_SEGMENT_COUNT
          }
          children="+ Add Segment"
        />

        <Button
          onClick={deleteSegment}
          disabled={
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length <= 1
          }
          children="- Delete Segment"
        />
        <br />
        <Button
          onClick={goToPreviousSegment}
          className="rounded _bg-state-warning"
          disabled={activeIndex < 1}
          children="< Go To previous"
        />
        <Button
          onClick={goToNextSegment}
          className="rounded _bg-state-warning"
          disabled={
            activeIndex >=
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length -
              1
          }
          children="Go Next Segment >"
        />
        <FormBuilderSegment
          compositions={compositions}
          edit={edit}
          usedFields={usedFields}
          setUsedFields={setUsedFields}
          activeVersionIndex={editVersion ? editIndex : activeVersionIndex}
          activeIndex={activeIndex}
        />
        <p
          children={`On section ${activeIndex + 1} of ${
            videoObj.versions[editVersion ? editIndex : activeVersionIndex].form
              .segments.length
          }`}
        />
        <Button
          onClick={() => {
            if (!editVersion) {
              setActiveVersionIndex(activeVersionIndex + 1);
            }
            openVersionDisplay();
          }}
          children={edit ? "Back To Versions" : "Create Version"}
        />
      </Form>
    );
  }
  if (versionDisplay) {
    const props = {
      edit,
      videoObj,
      openSegmentsBuilder,
      removeVersion,
      setComp_name,
      compositions,
      comp_name,
      segmentDisplay,
      handleSubmitForm,
      setSegmentDisplay,
      versionDisplay,
      setVersionDisplay,
    };
    return <VersionSummary {...props} />;
  }
  return (
    <div>
      {!edit && (
        <VideoTemplateMetaForm onSubmit={handleVideoTemplateMetaSubmit} />
      )}
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

// <button onClick={openVersionDisplay}>
//   {edit ? "View Versions" : "Create Versions"}
// </button>;
