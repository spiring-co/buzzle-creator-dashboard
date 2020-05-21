import React, { useContext, useState, useEffect } from "react";
import useActions from "contextStore/actions";
import { SegmentsContext } from "contextStore/store";
import { Button, TextField } from "@material-ui/core";

export default ({ activeVersionIndex, openSegmentBuilder }) => {
  const { editversionKeys } = useActions();

  const [videoObj] = useContext(SegmentsContext);
  const [value, setValue] = useState(0);

  useEffect(() => { }, [value]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <TextField
        variant="outlined"
        fulWidth={true}
        margin="dense"
        placeholder="Enter Version Title"
        label="Version Title"
        onChange={(e) => {

          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            title: e.target.value,
          });
        }}
        type="text"
        value={videoObj.versions[activeVersionIndex].title}
      />


      <TextField
        variant="outlined"
        fulWidth={true}
        margin="dense"
        onChange={(e) => {
          setValue(Math.random());
          editversionKeys(activeVersionIndex, {
            description: e.target.value,
          });
        }}
        placeholder="Enter Version Description"
        label="Version Description"

        type="text"
        value={videoObj.versions[activeVersionIndex].description}
      />
      <TextField
        variant="outlined"
        fulWidth={true}
        margin="dense"
        label="Version Price"
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

      <Button
        style={{ width: 'fit-content', marginTop: 10 }}
        color="primary"
        variant="contained"
        onClick={openSegmentBuilder}
        disabled={
          !videoObj.versions[activeVersionIndex].title &&
          !videoObj.versions[activeVersionIndex].price
        }
        children="Next"
      />
    </div>
  );
};
