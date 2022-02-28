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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getUniqueId } from "helpers"
import { imageComp, textComp } from "common/types";

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
type IProps = {
  editField: boolean,
  templateType: "ae" | "remotion",
  textLayers: Array<textComp>,
  imageLayers: Array<imageComp>,
  onClose: Function,
  onDataSubmit: Function,
  initialValue: any

}
export default ({ textLayers = [], onDataSubmit, initialValue, imageLayers = [], templateType = 'ae', editField, onClose }: IProps) => {

  const onSubmit = ({ key = "", property, label, layerName, maxLength, placeholder, propertyType, required, type, extension, height, width }: {
    key?: string,
    property: string,
    placeholder: string,
    extension?: string,
    propertyType: string,
    type: "data" | "image",
    label: string,
    required: boolean, maxLength: number,
    layerName: string, width?: number, height?: number
  }) => {
    switch (type) {
      case "data":
        onDataSubmit({
          key: editField ? key : getUniqueId(),
          type: propertyType,
          label, placeholder,
          constraints: property === "Source Text.text" ? {
            required,
            maxLength,
          } : { required },
          rendererData: { layerName, property: templateType === 'ae' ? property : '', type }
        })
        break;

      case "image":
        onDataSubmit({
          key: editField ? key : getUniqueId(),
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
            ? { layerName, type, extension: extension === "null" ? "png" : (extension || "png") }
            : { layerName, property: templateType === 'ae' ? property : '', type }

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
    resetForm,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues: initialValue,
    validationSchema,
    onSubmit,
  });

  const inputTypes = [
    { label: "Text", value: "data" },
    { label: "Image", value: "image" },
  ];

  const toggleDialog = (state: boolean) => {
    onClose(state);
  };

  const handleLayerChange = (value: string) => {
    setFieldValue('layerName', value)
    // set default text value to placeholder
    if (values?.type === "data") {
      const layerNames = textLayers.map((layer) => layer?.name ?? layer)
      setFieldValue('property', 'Source Text.text')
      setFieldValue('placeholder', textLayers[layerNames.indexOf(value)]?.text || "")
    }
    //set height and width coming from layer
    else {
      const layerNames = imageLayers.map((layer) => layer?.name ?? layer)
      setFieldValue('height', imageLayers[layerNames.indexOf(value)]["height"] || 0)
      setFieldValue('width', imageLayers[layerNames.indexOf(value)]["width"] || 0)
      setFieldValue('extension', imageLayers[layerNames.indexOf(value)]?.extension === "null" ? "png" : (imageLayers[layerNames.indexOf(value)]?.extension || "png"))
    }
  }
  const renderPropertyPicker = () => {
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
    if (!values?.type || !values?.propertyType || values?.propertyType === "image" || values?.propertyType === "string" || templateType === 'remotion') return <div />;
    return (
      <FormControl
        required={values?.propertyType === 'image' ? false : true}
        fullWidth
        margin="dense"
        variant="outlined"
        error={touched?.property && !!errors?.property}>
        <InputLabel id="property-select">Select Property</InputLabel>
        <Select
          labelId="property-select"
          id="property-select"
          onBlur={handleBlur}
          onChange={handleChange}
          name="property"
          value={values.property}
          placeholder="Click to Pick Property"
          label="Select Property">
          {p.map((item, index) => (
            <MenuItem
              key={item}
              id={item}
              value={item}
              children={item}
              selected={values.property === item}
            />
          ))}
        </Select>
        <FormHelperText
          error={touched?.property && !!errors?.property}
        >{touched?.property && !!errors?.property ? errors?.property : ""}</FormHelperText>
      </FormControl>
    );
  }
  const renderPropertyTypeSelector = () => {
    return (<FormControl
      required
      style={{ marginTop: 8, marginBottom: 8 }}
      component="fieldset">
      <FormLabel component="legend">Select Field Type</FormLabel>
      <RadioGroup aria-label="propertyType" name="propertyType" row
        defaultValue={'string'}
        value={values?.propertyType} onChange={handleChange}>
        <FormControlLabel value="string" disabled={values?.type === "image"} control={<Radio />} label="Text" />
        <FormControlLabel value="image" disabled={values?.type === "data"}
          control={<Radio />} label="Image" />
      </RadioGroup>
      <FormHelperText
        error={touched?.propertyType && !!errors?.propertyType}
      >{touched?.propertyType && !!errors?.propertyType ? errors?.propertyType
        : "Field type describes, what you want to input from a user, Text for date and text, while image is for picture"}</FormHelperText>
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
        error={touched?.label && !!errors?.label}
        helperText={touched?.label && !!errors?.label ? errors?.label : ""}
        type="text"
        label="Field Title"
        placeholder="Field Title"
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
        error={touched?.placeholder && !!errors?.placeholder}
        helperText={touched?.placeholder && !!errors?.placeholder ? errors?.placeholder : ""}
        type="text"
        label="Field Placeholder"
        placeholder="Enter Field Placeholder Text"
      />
      {values?.property === "Source Text.text" && <>   <TextField
        fullWidth
        required={values?.type === 'data' ? true : false}
        variant="outlined"
        margin="dense"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values?.maxLength}
        error={touched?.maxLength && !!errors?.maxLength}
        helperText={touched?.maxLength && !!errors?.maxLength ? errors?.maxLength : ""}
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
        error={touched?.label && !!errors?.label}
        helperText={touched?.label && !!errors?.label ? errors?.label : ""}
        type="text"
        label="Field Title"
        placeholder="Field Title"
      />

      {values?.propertyType === "image" && <>
        <TextField
          required={values?.type === "image" ? true : false}
          fullWidth
          variant="outlined"
          margin="dense"
          value={values?.width ?? 0}
          name="width"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched?.width && !!errors?.width}
          helperText={touched?.width && !!errors?.width ? errors?.width : ""}
          type="number"
          label="Image Width"
          placeholder="Enter Width"
        />
        <TextField
          required={values?.type === "image" ? true : false}
          fullWidth
          variant="outlined"
          margin="dense"
          value={values?.height ?? 0}
          name="height"
          onBlur={handleBlur}
          onChange={handleChange}
          error={touched?.height && !!errors?.height}
          helperText={touched?.height && !!errors?.height ? errors?.height : ""}
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
  const renderOptions = () => {
    switch (values?.type) {
      case "data":
        if (textLayers.length) {
          return textLayers.map((layer, index) => layer?.name ?? layer);
        } else {
          return [];
        }

      case "image":
        if (imageLayers.length) {
          return imageLayers.map((layer, index) => layer?.name ?? layer);
        } else {
          return [];
        }
      default:
        return [];
    }
  };

  return (
    <Dialog
      fullWidth
      open
      scroll="paper"
      onClose={() => toggleDialog(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{editField ? "Edit Field" : "Add Field"}</DialogTitle>
      <DialogContent dividers={true}>
        <FormControl
          fullWidth
          margin="dense"
          disabled={editField}
          variant="outlined"
          error={touched?.type && !!errors?.type}
        >
          <InputLabel id="demo-simple-select-outlined-label">
            Layer Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onBlur={handleBlur}
            onChange={ev => {
              if (ev.target.value) {
                setFieldValue('propertyType', ev.target.value === 'data' ? 'string' : ev.target.value === 'image' ? 'image' : "")
              }
              handleChange(ev)

            }}
            name="type"

            value={values?.type}
            placeholder="Select Layer Type"
            label="Layer Type"
          >
            {inputTypes.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  disabled={values?.type === item.value}
                  value={item.value}
                  children={item.label}
                  selected={values?.type === item.value}
                />
              );
            })}
          </Select>
          <FormHelperText>{touched?.type && errors?.type}</FormHelperText>
        </FormControl>
        <Autocomplete
          value={values?.layerName}
          onChange={(event, newValue) => {
            if (newValue) {
              handleLayerChange(newValue as string)
            }
          }}
          autoHighlight={true}
          id="controllable-states-demo"
          options={renderOptions()}
          renderInput={(params) => <TextField
            // fullWidth={true}
            margin="dense"
            {...params}
            label="Select Layer" variant="outlined"
            error={!!(touched?.layerName && !!errors?.layerName)}
            helperText={touched?.layerName && !!errors?.layerName ? errors?.layerName : ""}

          />}
        />
        {renderPropertyTypeSelector()}
        {renderPropertyPicker()}
        {renderInputForm()}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleDialog(false)} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={e => handleSubmit()}
          color="primary"
          children={editField ? "Save" : "Add"}
        />
      </DialogActions>
    </Dialog>
  );
};
