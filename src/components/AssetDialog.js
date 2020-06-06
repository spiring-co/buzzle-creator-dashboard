import React, { useState, useEffect } from "react";
import {
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = null;

const defaultValues = {
  type: "data",
  value: "",
};

export default ({
  editableLayers,
  initialValues,
  setIsDialogOpen,
  onSubmit,
}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: initialValues || defaultValues,
    validationSchema,
    onSubmit: (a) =>
      onSubmit({
        layerName: editableLayers[selectedLayerIndex].layerName,
        ...a,
      }),
  });

  /*
  IMPORTANT!

  'type' refers to the asset type that could be src (in case of file replacement) or data(refers to property)
  'editableLayers[selectedLayerIndex].type' refers to the type of layer that could be image video audio or text

  */

  function SourceInput({ handleBlur, handleChange, value, touched, error }) {
    if (
      !editableLayers[selectedLayerIndex]?.type ||
      editableLayers[selectedLayerIndex]?.type === "data"
    )
      return <div />;
    return (
      <TextField
        fullWidth
        variant="outlined"
        margin="dense"
        name="src"
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched && error}
        helperText={touched && error}
        type="file"
      />
    );
  }

  function ValueInput({
    type,
    handleBlur,
    handleChange,
    touched,
    error,
    value,
  }) {
    if (!type) return <div />;
    switch (type) {
      default:
        return (
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            value={value}
            name="value"
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched && error}
            helperText={touched && error}
            type="text"
            label={"Value"}
            placeholder={"Enter Value Here"}
          />
        );
    }
  }

  function PropertyPicker({
    type,
    handleBlur,
    handleChange,
    value,
    touched,
    error,
  }) {
    if (!type) return <div />;
    const layerProperties = ["scale", "color"];
    const propertiesByType = {
      data: [
        "Source Text",
        "Source Text.font",
        "Source Text.fontSize",
        "Source Text.fontLocation",
        "Source Text.fillColor",
      ],
      image: ["opacity", "height"],
    };

    const p = layerProperties.concat(propertiesByType[type]);
    return (
      <FormControl
        fullWidth
        margin="dense"
        variant="outlined"
        error={touched && error}>
        <InputLabel id="property-select">Select Property</InputLabel>

        <Select
          labelId="property-select"
          id="property-select"
          onBlur={handleBlur}
          onChange={handleChange}
          name="property"
          value={value}
          placeholder="Click to Pick Property"
          label="Select Property">
          {p.map((item, index) => (
            <MenuItem
              key={index}
              id={index}
              value={item}
              children={item}
              selected={value === item}
            />
          ))}
        </Select>
        <FormHelperText>{touched && error}</FormHelperText>
      </FormControl>
    );
  }

  return (
    <Dialog
      fullWidth
      open
      onClose={() => setIsDialogOpen(false)}
      aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogTitle id="form-dialog-title">{"Edit Asset"}</DialogTitle>

          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="layer-select">Select Layer</InputLabel>
            <Select
              labelId="layer-select"
              id="layer-select"
              onChange={(e) => setSelectedLayerIndex(e.target.value)}
              name="layerName"
              value={selectedLayerIndex}
              placeholder="Click to Pick Layer"
              label="Select Layer">
              {editableLayers.map((item, index) => (
                <MenuItem
                  key={index}
                  id={index}
                  value={index}
                  children={item.layerName}
                  selected={selectedLayerIndex === index}
                />
              ))}
            </Select>
          </FormControl>
          {editableLayers[selectedLayerIndex] && (
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Asset Type</FormLabel>
              <RadioGroup
                aria-label="type"
                name="type"
                value={values.type}
                onChange={handleChange}>
                {(editableLayers[selectedLayerIndex].type === "data"
                  ? ["data"]
                  : ["data", "src"]
                ).map((t) => (
                  <FormControlLabel
                    key={t}
                    value={t}
                    control={<Radio />}
                    label={t}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {values.type === "data" ? (
            <>
              <PropertyPicker
                errors={errors.property}
                touched={touched.property}
                value={values.property}
                type={editableLayers[selectedLayerIndex].type}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
              <ValueInput
                errors={errors.value}
                touched={touched.value}
                value={values.value}
                type={values.property}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />
            </>
          ) : (
            <SourceInput
              errors={errors.src}
              touched={touched.src}
              src={values.src}
              type={values.type}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            children={"Add Asset"}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
