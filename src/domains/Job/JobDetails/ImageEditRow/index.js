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
    width,
    isValid,

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
        error={isValid ? null : "Invalid image/format"}
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
export default ({ onChange, value, height, width, extension = 'png' }) => {
  const [imageEditType, setImageEditType] = useState("image");
  const [isValid, setIsValid] = useState(value.split(".").pop() === extension)
  const handleChange = (v) => {
    setIsValid(v.split(".").pop() === extension)
    onChange(v)
  }
  return (
    <>
      {/* <FormControl component="fieldset">
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
        width, isValid
      )}
      */}
      <FileUploader
        value={value}
        cropEnabled={true}
        height={height}
        width={width}
        onChange={handleChange}
        uploadDirectory={"jobImages"}
        onError={null}
        error={isValid ? null : "Invalid image/format"}
        name={null}
      />

    </>
  );
};
