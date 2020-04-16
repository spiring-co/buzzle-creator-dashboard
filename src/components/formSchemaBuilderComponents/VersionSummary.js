import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default ({
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
}) => {
  return (
    <div>
      <p>{edit ? "View Versions" : "Create Versions"}</p>

      {videoObj?.versions.map((item, index) => {
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
      {!edit && (
        <Form>
          <Form.Group as={Row}>
            <Col sm="7">
              <Form.Control
                as="select"
                value="Choose..."
                onChange={(e) => setComp_name(e.target.value)}
              >
                <option disabled selected value="">
                  Select Composition
                </option>
                {compositions.map((item, index) => {
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
                disabled={comp_name === ""}
              >
                Add
              </Button>
            </Col>
          </Form.Group>
        </Form>
      )}
      <br />
      <Button
        variant="outline-primary"
        style={{ float: "left", marginRight: "2%" }}
        onClick={() =>
          segmentDisplay ? setSegmentDisplay(false) : setVersionDisplay(false)
        }
        disabled={!segmentDisplay && !versionDisplay}
      >
        Back
      </Button>
      <Button
        style={{ float: "left" }}
        variant="outline-primary"
        disabled={videoObj.versions.length === 0}
        onClick={handleSubmitForm}
      >
        {edit ? "Save Edits" : "Submit Form"}
      </Button>
    </div>
  );
};
