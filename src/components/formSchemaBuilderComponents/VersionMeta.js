import React, { useContext, useState, useEffect } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import { Form, Button } from "react-bootstrap";

export default ({ activeVersionIndex, openSegmentBuilder }) => {
  const { editversionKeys } = useActions();

  const [videoObj] = useContext(SegmentsContext);
  const [value, setValue] = useState(0);

  useEffect(() => {}, [value]);

  return (
    <Form>
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            title: e.target.value,
          });
        }}
        placeholder="Enter Version Title"
        type="text"
        value={videoObj.versions[activeVersionIndex].title}
      />
      <br />
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            description: e.target.value,
          });
        }}
        placeholder="Enter Version Description"
        type="text"
        value={videoObj.versions[activeVersionIndex].description}
      />
      <br />
      <Form.Control
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            price: e.target.value,
          });
        }}
        placeholder="Enter Version Price"
        type="number"
        value={videoObj.versions[activeVersionIndex].price}
      />
      <br />
      <Button
        onClick={openSegmentBuilder}
        disabled={
          !videoObj.versions[activeVersionIndex].title &&
          !videoObj.versions[activeVersionIndex].price
        }
        children="Next"
      />
    </Form>
  );
};
