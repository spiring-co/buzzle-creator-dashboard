import React from "react";
import {
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Layer type is required!"),
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
    var { type, label, required, maxLength, layerName, width, height } = data;
    switch (type) {
      case "data":
        props.editField
          ? props.editFieldValue({
            type,
            label,
            required,
            maxLength,
            layerName,
          })
          : props.addField({ type, label, required, maxLength, layerName });
        break;

      case "image":
        props.editField
          ? props.editFieldValue({
            type,
            label,
            required,
            width,
            height,
            layerName,
          })
          : props.addField({ type, label, required, width, height, layerName });
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
  } = useFormik({
    initialValues: props.initialValue
    ,
    validationSchema,
    onSubmit,
  });

  const inputTypes = [
    { label: "Text", value: "data" },
    // { label: "Picker", value: "custom_picker" },
    { label: "Image", value: "image" },
  ];

  const toggleDialog = (state) => {
    props.toggleDialog(state);
  };

  const renderTextInputCreator = () => (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        margin="dense"
        value={values.label}
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
        fullWidth
        variant="outlined"
        margin="dense"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.maxLength}
        error={touched.maxLength && errors.maxLength}
        helperText={touched.maxLength && errors.maxLength}
        type="number"
        name="maxLength"
        label="Max length"
        placeholder="Max length"
      />
      <br />

      <FormControlLabel
        control={
          <Switch
            checked={values.required}
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
        fullWidth
        variant="outlined"
        margin="dense"
        value={values.label}
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
        fullWidth
        variant="outlined"
        margin="dense"
        value={values.width}
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
        fullWidth
        variant="outlined"
        margin="dense"
        value={values.height}
        name="height"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.height && errors.height}
        helperText={touched.height && errors.height}
        type="number"
        label="Image Height"
        placeholder="Enter Height"
      />

      <br />
      <FormControlLabel
        control={
          <Switch
            checked={values.required}
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
    switch (values.type) {
      case "data":
        return renderTextInputCreator();

      case "image":
        return renderImageCreator();

      default:
        return null;
    }
  };
  const fieldsSelector = () => {
    switch (values.type) {
      case "data":
        if (textLayers.length) {
          return textLayers.map((item, index) => {
            if (
              props.usedFields.includes(item.name) &&
              values.layerName !== item.name
            ) {
              return false;
            }
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
            if (
              props.usedFields.includes(item.name) &&
              values.layerName !== item.name
            ) {
              return false;
            }
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
              value={values.type}
              placeholder="Select Layer Type"
              label="Layer Type"
            >
              {inputTypes.map((item, index) => {
                return (
                  <MenuItem
                    key={index}
                    id={index}
                    disabled={values.type === item.value}
                    value={item.value}
                    children={item.label}
                    selected={values.type === item.value}
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
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              name="layerName"
              value={values.layerName}
              placeholder="Select Layer"
              label="Select Layer"
            >
              {fieldsSelector()}
            </Select>
            <FormHelperText>
              {touched.layerName && errors.layerName}
            </FormHelperText>
          </FormControl>

          {renderInputForm(values.type)}
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
