import React, { useContext, useEffect, useState } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext, StateProvider } from "contextStore/store";
<<<<<<< HEAD
import SegmentDisplay from "./SegmentDisplay";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";
=======
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import VersionSummary from "./VersionSummary";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

const MAX_SEGMENT_COUNT = 5;
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a

function FormBuilder({ submitForm, edit, video }) {
  const [videoObj] = useContext(SegmentsContext);

  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState(true);
  const [editVersion, setEditVersion] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState(0);
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
    submitForm(videoObj);
  };

  const handleVideoTemplateMetaSubmit = async (data) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
}

export default (props) => {
  return (
    <StateProvider>
      <FormBuilder {...props} />
    </StateProvider>
  );
};
<<<<<<< HEAD
=======

// <button onClick={openVersionDisplay}>
//   {edit ? "View Versions" : "Create Versions"}
// </button>;
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
