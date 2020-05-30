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
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";



export default (props) => {
  const { editableLayers, initialValue } = props;
  console.log(initialValue)
  const layerNames = editableLayers.map(({ layerName }) => layerName)
  const [type, setType] = useState("")
  const [width, setWidth] = useState(300)
  const [height, setHeight] = useState(300)
  const [maxLength, setMaxLength] = useState(50)
  const [label, setLabel] = useState("Enter Value")
  const onSubmit = (data) => {
    var { layerName, src, value } = data;
    switch (type) {
      case "data":
        props.editAsset
          ? props.editAssetValue({
            type, layerName, property: "Source Text", value
          })
          : props.addAsset({ type, layerName, property: "Source Text", value });
        break;

      case "image":
        props.editAsset
          ? props.editAssetValue({
            type, layerName, extension: "png", src: "https://dummyimage.com/500x500/329da8/fff"
          })
          : props.addAsset({ type, layerName, extension: "png", src: "https://dummyimage.com/500x500/329da8/fff" });
        break;
      default:
        throw new Error();
    }
    toggleDialog(false);
  };

  const validationSchema = Yup.object().shape({

    value: Yup.string().when("type", {
      is: "data",
      then: Yup.string().max(maxLength).required('Value is required!'),
      otherwise: Yup.string(),
    }),
    src: Yup.string().when("type", {
      is: "image",
      then: Yup.string().required("Image is required!"),
      otherwise: Yup.string(),
    }),

  });
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: props.initialValue
      ? props.initialValue
      : {
        type: "",
        layerName: "",
        value: "",
        src: ""
      },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // set type of data base on layerNaME
    if (values?.layerName !== "") {
      var { type, width, height, maxLength, label } = editableLayers[layerNames.indexOf(values.layerName)]
      console.log(type)
      setType(type)
      setHeight(height)
      setWidth(width)
      setMaxLength(maxLength)
      setLabel(label)
    }

  }, [values.layerName, type])



  const toggleDialog = (state) => {
    props.toggleDialog(state);
  };

  const renderTextInput = () => (
    <div>
      <TextField

        fullWidth
        variant="outlined"
        margin="dense"
        value={values.value}
        name="value"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.value && errors.value}
        helperText={touched.value && errors.value}
        type="text"
        label={label}
        placeholder={label}
      />

    </div>
  );

  const renderImagePicker = () => (
    <div>
      <TextField
        fullWidth
        variant="outlined"
        margin="dense"
        name="src"
        onBlur={handleBlur}
        onChange={handleChange}
        error={touched.src && errors.src}
        helperText={touched.src && errors.src}
        type="file"

      />

    </div>
  );
  const renderInputForm = () => {
    switch (type) {
      case "data":
        return renderTextInput();

      case "image":
        return renderImagePicker();

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
        <DialogTitle id="form-dialog-title">Add Asset</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
            error={touched.layerName && errors.layerName}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Select Asset Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              onBlur={handleBlur}
              onChange={handleChange}
              name="layerName"
              value={values.layerName}
              placeholder="Select Asset Name"
              label="Select Asset Name"
            >

              {layerNames.map((item, index) => {
                if (props.usedLayers.includes(item) &&
                  values.layerName !== item) {
                  return <MenuItem disabled={true} children="No Layer Left" />;

                }
                return (
                  <MenuItem
                    key={index}
                    id={index}
                    disabled={values.layerName === item}
                    value={item}
                    children={editableLayers[index].label}
                    selected={values.layerName === item}
                  />
                );
              })}
            </Select>
            <FormHelperText>{touched.layerName && errors.layerName}</FormHelperText>
          </FormControl>

          {renderInputForm(type)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            children={props.editAsset ? "Edit" : "Add Asset"}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};
