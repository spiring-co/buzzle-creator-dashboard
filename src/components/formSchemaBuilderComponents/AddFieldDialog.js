import React from "react";
import {
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormHelperText,
  InputLabel, FormLabel,
  FormControlLabel, RadioGroup, Radio,
  Switch,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUniqueId } from "services/helper"

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Layer type is required!"),
  propertyType: Yup.string().required("Property Type is required!"),
  property: Yup.string().when("propertyType", {
    is: "image",
    then: Yup.string(),
    otherwise: Yup.string().required("Property of the layer is required!")
  }),
  placeholder: Yup.string().when('type', {
    is: 'data',
    then: Yup.string().required('Placeholder is required!'),
    otherwise: Yup.string()
  }),
  layerName: Yup.string().required("Layer name is required!"),
  label: Yup.string().required("Field Label is required!"),
  maxLength: Yup.number().when("type", {
    is: "data", // alternatively: (val) => val == true
    then: Yup.number().required("Max Length is required"),
    otherwise: Yup.number(),
  }),
  width: Yup.number().when("type", {
    is: "image", // alternatively: (val) => val == true
    then: Yup.number().required("Width of image is required"),
    otherwise: Yup.number(),
  }),
  height: Yup.number().when("type", {
    is: "image", // alternatively: (val) => val == true
    then: Yup.number().required("Height of image is required"),
    otherwise: Yup.number(),
  }),
});

export default (props) => {
  const { textLayers = [], imageLayers = [] } = props;

  const onSubmit = (data) => {
    const { key, property, placeholder, extension, propertyType, type, label, required, maxLength, layerName, width, height } = data;

    switch (type) {
      case "data":
        props.handleChange({
          key: props.editField ? key : getUniqueId(),
          type: propertyType,
          label, placeholder,
          constraints: property === "Source Text.text" ? {
            required,
            maxLength,
          } : { required },
          rendererData: { layerName, property, type }
        })
        break;

      case "image":
        props.handleChange({
          key: props.editField ? key : getUniqueId(),
          type: propertyType,
          label,
          constraints: propertyType === "image"
            ? {
              required,
              width,
              height
            }
            : { required },
          rendererData: propertyType === "image"
            ? { layerName, type, extension }
            : { layerName, property, type }

        })
        break;
      default:
        throw new Error();
    }
    toggleDialog(false);
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues: props.initialValue,
    validationSchema,
    onSubmit,
  });

  const inputTypes = [
    { label: "Text", value: "data" },
    { label: "Image", value: "image" },
  ];

  const toggleDialog = (state) => {
    props.toggleDialog(state);
  };

  const handleLayerChange = (e) => {
    const value = e.target.value
    setFieldValue('layerName', value)
    // set default text value to placeholder
    if (values?.type === "data") {
      const layerNames = textLayers.map(({ name }) => name)
      setFieldValue('placeholder', textLayers[layerNames.indexOf(value)].text)
    }
    //set height and width coming from layer
    else {
      const layerNames = imageLayers.map(({ name }) => name)
      setFieldValue('height', imageLayers[layerNames.indexOf(value)]["height"])
      setFieldValue('width', imageLayers[layerNames.indexOf(value)]["width"])
      setFieldValue('extension', imageLayers[layerNames.indexOf(value)]?.extension ?? "png")
    }
  }
  function PropertyPicker({
    handleBlur,
    handleChange,
    value,
    touched,
    error,
  }) {
    if (!values?.type || !values?.propertyType || values?.propertyType === "image") return <div />;
    const layerProperties = ["scale", "color"];
    const propertiesByType = {
      data: [
        "Source Text.text",
        "Source Text.font",
        "Source Text.fontSize",
        "Source Text.fillColor",
      ],
      image: ["opacity"],
    };

    const p = layerProperties.concat(propertiesByType[values?.type]);
    return (
      <FormControl
        required={values?.propertyType === 'image' ? false : true}
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
  const renderPropertyTypeSelector = () => {

    return (<FormControl
      required
      component="fieldset">
      <FormLabel component="legend">Select Property Type</FormLabel>
      <RadioGroup aria-label="propertyType" name="propertyType" row
        value={values?.propertyType} onChange={handleChange}>
        <FormControlLabel value="string" control={<Radio />} label="Data" />
        <FormControlLabel value="image" disabled={values?.type === "data"}
          control={<Radio />} label="Image" />
      </RadioGroup>
    </FormControl>)

  }
  const renderTextInputCreator = () => (
    <div>
      <TextField
        required
        fullWidth
        variant="outlined"
        margin="dense"
        value={values?.label}
        name="label"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.label && errors.label}
        helperText={touched.label && errors.label}
        type="text"
        label="Layer Label"
        placeholder="Layer Label"
      />
      <TextField
        required={values?.type === 'data' ? true : false}
        fullWidth
        variant="outlined"
        margin="dense"
        value={values?.placeholder}
        name="placeholder"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.placeholder && errors.placeholder}
        helperText={touched.placeholder && errors.placeholder}
        type="text"
        label="Layer Placeholder"
        placeholder="Enter Placeholder Text"
      />
      {values?.property === "Source Text.text" && <>   <TextField
        fullWidth
        required={values?.type === 'data' ? true : false}
        variant="outlined"
        margin="dense"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values?.maxLength}
        error={touched.maxLength && errors.maxLength}
        helperText={touched.maxLength && errors.maxLength}
        type="number"
        name="maxLength"
        label="Max length"
        placeholder="Max length"
      /></>}
      <br />

      <FormControlLabel
        control={
          <Switch
            checked={values?.required}
            onBlur={handleBlur}
            name="required"
            onChange={handleChange}
            color="primary"
          />
        }
        label="Required"
      />
    </div>
  );

  const renderImageCreator = () => (
    <div>
      <TextField
        required
        fullWidth
        variant="outlined"
        margin="dense"
        value={values?.label}
        name="label"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.label && errors.label}
        helperText={touched.label && errors.label}
        type="text"
        label="Layer Label"
        placeholder="Layer Label"
      />

      {values?.propertyType === "image" && <>
        <TextField
          required={values?.type === "image" ? true : false}
          fullWidth
          variant="outlined"
          margin="dense"
          value={values?.width}
          name="width"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.width && errors.width}
          helperText={touched.width && errors.width}
          type="number"
          label="Image Width"
          placeholder="Enter Width"
        />
        <TextField
          required={values?.type === "image" ? true : false}
          fullWidth
          variant="outlined"
          margin="dense"
          value={values?.height}
          name="height"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched.height && errors.height}
          helperText={touched.height && errors.height}
          type="number"
          label="Image Height"
          placeholder="Enter Height"
        /></>
      }
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={values?.required}
            onBlur={handleBlur}
            name="required"
            onChange={handleChange}
            color="primary"
          />
        }
        label="Required"
      />
    </div>
  );
  const renderInputForm = () => {
    switch (values?.type) {
      case "data":
        return renderTextInputCreator();

      case "image":
        return renderImageCreator();

      default:
        return null;
    }
  };
  const fieldsSelector = () => {
    switch (values?.type) {
      case "data":
        if (textLayers.length) {
          return textLayers.map((item, index) => {

            return (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            );
          });
        } else {
          return <MenuItem disabled={true} children="No Text layer" />;
        }

      case "image":
        if (imageLayers.length) {
          return imageLayers.map((item, index) => {
            return (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            );
          });
        } else {
          return <MenuItem disabled={true} children="No Image layer" />;
        }

      default:
        return null;
    }
  };

  return (
    <Dialog
      fullWidth
      open
      onClose={() => toggleDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Add Field</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            error={touched.type && errors.type}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Layer Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              name="type"
              value={values?.type}
              placeholder="Select Layer Type"
              label="Layer Type"
            >
              {inputTypes.map((item, index) => {
                return (
                  <MenuItem
                    key={index}
                    id={index}
                    disabled={values?.type === item.value}
                    value={item.value}
                    children={item.label}
                    selected={values?.type === item.value}
                  />
                );
              })}
            </Select>
            <FormHelperText>{touched.type && errors.type}</FormHelperText>
          </FormControl>
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            error={touched.layerName && errors.layerName}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Select Layer
            </InputLabel>
            <Select
              required
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onBlur={handleBlur}
              onChange={handleLayerChange}
              name="layerName"
              value={values?.layerName}
              placeholder="Select Layer"
              label="Select Layer"
            >
              {fieldsSelector()}
            </Select>
            <FormHelperText>
              {touched.layerName && errors.layerName}
            </FormHelperText>
          </FormControl>
          {renderPropertyTypeSelector()}
          <PropertyPicker
            type={values?.type}
            handleBlur={handleBlur}
            handleChange={handleChange}
            touched={touched.property}
            error={touched.property && errors.property}
            value={values?.property}
          />
          {renderInputForm(values?.type)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            children={props.editField ? "Edit" : "Add Field"}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
