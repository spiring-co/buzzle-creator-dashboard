import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";

export default ({
  edit,
  setEditIndex,
  setEditVersion,
  compositions,
  activeDisplayIndex,
  handleSubmitForm,
  setActiveDisplayIndex,
}) => {
  const [videoObj] = useContext(SegmentsContext);

  const { addVersion, removeVersion } = useActions();

  const [comp_name, setComp_name] = useState("");

  const openSegmentsBuilder = (index, fromEdit = false) => {
    if (fromEdit) {
      setEditIndex(index);
      setEditVersion(true);
    } else {
      addVersion({ comp_name });
    }
    setActiveDisplayIndex(2);
  };

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
        disabled={videoObj.versions.length === 0}
        onClick={handleSubmitForm}
      >
        {edit ? "Save Edits" : "Submit Form"}
      </Button>
    </div>
  );
};

{
  /* <div style={{ textAlign: "center" }}>
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
        <div style={{ margin: 10 }}>
          <select onChange={(e) => setComp_name(e.target.value)}>
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
          </select>
          <button
            onClick={() => openSegmentsBuilder()}
            disabled={comp_name === ""}
          >
            Add
          </button>
        </div>
      )}
      <br />
      <button
        onClick={() =>
          activeDisplayIndex === 2
            ? setActiveDisplayIndex(1)
            : setActiveDisplayIndex(0)
        }
        disabled={!activeDisplayIndex === 2 && !activeDisplayIndex === 1}
      >
        Back
      </button>
      <button
        disabled={videoObj.versions.length === 0}
        onClick={handleSubmitForm}
      >
        {edit ? "Save Edits" : "Submit Form"}
      </button>
    </div> */
}
