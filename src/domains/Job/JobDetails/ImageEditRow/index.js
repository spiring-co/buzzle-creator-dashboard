import React, { createRef, useEffect, useState } from "react";
import {
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  TextField, Button
} from "@material-ui/core";
import FileUploader from "common/FileUploader";
import Jimp from 'jimp/es';
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
export default ({ onChange, value, height, width, extension = 'png', name = `${Date.now()}` }) => {
  const [imageEditType, setImageEditType] = useState("image");
  const [isValid, setIsValid] = useState(value.split(".").pop() === extension)
  const [isConverting, setIsConverting] = useState(false)
  const ref = createRef()
  const handleChange = (v) => {
    setIsValid(v.split(".").pop() === extension)
    onChange(v)
  }
  const handleConvert = async () => {
    if (ref?.current) {
      setIsConverting(true)
      let image = await Jimp.read(value)
      image = await image.quality(extension === 'png' ? 5 : 20).getBufferAsync(extension === 'png' ? Jimp.MIME_PNG : Jimp.MIME_JPEG)
      setIsConverting(false)
      setIsValid(true)
      await ref?.current?.handleUpload(image, extension)
    }
  }
  useEffect(() => {
  }, [ref])
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
        ref={ref}
        label={"Image"}
        value={value}
        extension={extension}
        helperText=""
        storageType="deleteAfter90Days"
        cropEnabled={false}
        height={height}
        width={width}
        accept={`image/${extension}`}
        onChange={handleChange}
        uploadDirectory={"jobImages"}
        error={isValid ? undefined : new Error("Invalid image/format")}
        name={name}
      />
      {!isValid && <div style={{ marginTop: 5 }}>
        <Button
          children={isConverting ? 'converting...' : `Convert to ${extension}`}
          color="primary"
          variant="contained"
          disabled={isConverting}
          onClick={handleConvert}
        />
      </div>}
    </>
  );
};
