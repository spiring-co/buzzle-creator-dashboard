import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default ({
  edit: isEditing,
  setEditIndex,
  setEditVersion,
  compositions,
  activeDisplayIndex,
  handleSubmitForm,
  setActiveDisplayIndex,
}) => {
  const [videoTemplate] = useContext(SegmentsContext);

  const { addVersion, removeVersion } = useActions();

  const [compositionName, setComposition] = useState("");

  const openSegmentsBuilder = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      addVersion({ compositionName });
    }
    setActiveDisplayIndex(2);
  };

  return (
    <div>
      <h4>Versions</h4>
      {!videoTemplate?.versions?.length && (
        <p>
          You have not created any versions for this template yet, create one to
          get started.
        </p>
      )}
      <Button>+ Add Version</Button>

      {videoTemplate?.versions.map((item, index) => {
        return (
          <div style={{ border: "1px solid black", padding: 10, margin: 10 }}>
            <p style={{ fontSize: 15 }}>{JSON.stringify(item)}</p>
            <button onClick={() => openSegmentsBuilder(index, true)}>
              Edit
            </button>
            <span> </span>
            <button onClick={() => removeVersion(index)}>Delete</button>
          </div>
        );
      })}
      {!isEditing && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Group as={Row}>
            <Col sm="7">
              <Form.Control
                as="select"
                value={compositionName}
                onChange={(e) => setComposition(e.target.value)}
              >
                <option disabled selected value="">
                  Select Composition
                </option>
                {Object.keys(compositions).map((item, index) => {
                  return (
                    <option key={index} id={index} value={item}>
                      {item}
                    </option>
                  );
                })}
              </Form.Control>
            </Col>
            <Col sm="3">
              <Button
                // style={{ float: "right" }}
                variant="outline-primary"
                onClick={() => openSegmentsBuilder()}
                disabled={compositionName === ""}
              >
                Add
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
      <br />
      <Button
        onClick={() =>
          activeDisplayIndex === 2
            ? setActiveDisplayIndex(1)
            : setActiveDisplayIndex(0)
        }
        disabled={!activeDisplayIndex === 2 && !activeDisplayIndex === 1}
      >
        Back
      </Button>
      <Button
        style={{ float: "left" }}
        variant="outline-primary"
        disabled={videoTemplate.versions.length === 0}
        onClick={handleSubmitForm}
      >
        {isEditing ? "Save Edits" : "Submit Form"}
      </Button>
    </div>
  );
};
