import React, { useState } from "react";
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
} from "@material-ui/core";
import FileUploader from "common/FileUploader";

const imageEditComponent = {
  image: function (
    value,
    onChange,
    uploadDirectory,
    onError,
    key,
    height,
    width
  ) {
    return (
      <FileUploader
        value={value}
        cropEnabled={true}
        height={height}
        width={width}
        onChange={onChange}
        uploadDirectory={"jobImages"}
        onError={null}
        name={key}
      />
    );
  },
  text: function (value, onChange) {
    return (
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
      />
    );
  },
};
export default ({ onChange, value, height, width }) => {
  const [imageEditType, setImageEditType] = useState("image");
  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup
          value={imageEditType}
          onChange={(e) => setImageEditType(e.target.value)}
          row>
          <FormControlLabel
            value="image"
            control={<Radio />}
            label="Image"
            labelPlacement="end"
          />
          <FormControlLabel
            value="text"
            control={<Radio />}
            label="URL"
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
      {imageEditComponent[imageEditType](
        value,
        onChange,
        "jobImages",
        null,
        Date.now(),
        height,
        width
      )}
    </>
  );
};
