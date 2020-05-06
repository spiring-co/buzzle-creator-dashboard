import React from "react";
import { Button, Form, Col, Row } from "react-bootstrap";

export default ({ comp_name, setComp_name, compositions, openVersionMeta }) => {
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Form.Group as={Row}>
        <Col sm="7">
          <Form.Control
            as="select"
            value={comp_name}
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
            onClick={() => openVersionMeta()}
            disabled={comp_name === ""}
          >
            Add
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};
