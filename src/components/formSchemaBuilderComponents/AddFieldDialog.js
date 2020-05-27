import React, { useEffect } from "react";
import {
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';


export default (props) => {
  const { textLayers = [], imageLayers = [] } = props;

  // layers coming may comes as array of object ,
  //currently all layers are configured as they are array of strings,
  //except textLayers which is configured as {layerName:string,value:string}
  const [type, setType] = React.useState(props?.field?.type ?? null);
  const [layerName, setLayerName] = React.useState(props?.field?.layerName ?? null);
  const [required, setRequired] = React.useState(
    props?.field?.required ?? false
  );
  const [label, setLabel] = React.useState(props?.field?.label ?? "");
  const [maxLength, setMaxLength] = React.useState(
    props?.field?.maxLength ?? null
  );

  const [width, setWidth] = React.useState(props?.field?.width ?? 0);
  const [height, setHeight] = React.useState(props?.field?.height ?? 0);

  const inputTypes = [
    { label: "Text", value: "data" },
    // { label: "Picker", value: "custom_picker" },
    { label: "Image", value: "image" },
  ];

  const toggleDialog = (state) => {
    props.toggleDialog(state);
  };

  const handleFieldSubmit = () => {
    switch (type) {
      case "data":
        props.editField
          ? props.editFieldValue({ type, label, required, maxLength, layerName })
          : props.addField({ type, label, required, maxLength, layerName });
        break;

      case "image":
        props.editField
          ? props.editFieldValue({ type, label, required, width, height, layerName })
          : props.addField({ type, label, required, width, height, layerName });
        break;
      default:
        throw new Error();
    }
    toggleDialog(false);
  };

  const renderTextInputCreator = () => (
    <div>
      <TextField
        style={{ width: 400 }}
        variant="outlined"
        margin="dense"
        label="Layer Lable"
        placeholder="Layer Lable"
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />

      <TextField
        style={{ width: 400 }}
        variant="outlined"
        margin="dense"
        label="Max length"
        placeholder="Max length"
        type="number"
        value={maxLength}
        onChange={(e) => setMaxLength(e.target.value)}
      />
      <br />

      <FormControlLabel
        control={<Switch
          checked={required}
          name="required"
          onChange={(e) => {
            setRequired(e.target.checked);
          }}
          color="primary"
        />}
        label="Required"
      />

    </div>
  );


  const renderImageCreator = () => (
    <div>
      <TextField
        style={{ width: 400 }}
        variant="outlined"
        margin="dense"
        label="Layer Lable"
        placeholder="Layer Lable"
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <TextField
        style={{ width: 400 }}
        variant="outlined"
        margin="dense"
        label="Image Width"
        placeholder="Enter Width"
        type="number"
        value={width}
        onChange={(e) => {
          setWidth(e.target.value);
        }}
      />
      <TextField
        style={{ width: 400 }}
        variant="outlined"
        margin="dense"
        label="Image Height"
        placeholder="Enter Height"
        type="number"
        value={height}
        onChange={(e) => {
          setHeight(e.target.value);
        }}
      />

      <br />
      <FormControlLabel
        control={<Switch
          checked={required}
          name="required"
          onChange={(e) => {
            setRequired(e.target.checked);
          }}
          color="primary"
        />}
        label="Required"
      />

    </div>
  );
  const renderInputForm = () => {
    switch (type) {
      case "data":
        return renderTextInputCreator();

      case "image":
        return renderImageCreator();

      default:
        return null;
    }
  };
  const fieldsSelector = () => {
    switch (type) {
      case "data":
        if (textLayers.length) {
          return textLayers.map((item, index) => {

            if (props.usedFields.includes(item.name) && layerName !== item.name) {
              return false;
            }
            return (
              <MenuItem key={index} value={item.name} >
                {item.name}
              </MenuItem>
            );
          });
        }
        else {
          return <MenuItem disabled={true} children="No Text layer" />
        }


      case "image":
        if (imageLayers.length) {
          return imageLayers.map((item, index) => {
            if (props.usedFields.includes(item.name)) {
              return false;
            }
            return (
              <MenuItem key={index} value={item.name}>
                {item.name}
              </MenuItem>
            );
          });
        }
        else {
          return <MenuItem disabled={true} children="No Image layer" />
        }

      default:
        return null;
    }
  };

  return (
    <Dialog open onClose={() => toggleDialog(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Field</DialogTitle>
      <DialogContent>
        <FormControl
          style={{ width: 400 }}
          margin="dense"
          variant="outlined"
        >
          <InputLabel id="demo-simple-select-outlined-label">Layer Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={({ target: { value } }) => setType(value)}
            value={type}
            placeholder="Select Layer Type"
            label="Layer Type"
          >

            {inputTypes.map((item, index) => {
              return (
                <MenuItem key={index}
                  id={index}
                  disabled={type === item.value}
                  value={item.value}
                  children={item.label}
                  selected={type === item.value} />

              );
            })}
          </Select>
        </FormControl>
        <FormControl
          style={{ width: 400 }}
          margin="dense"
          variant="outlined"
        >
          <InputLabel id="demo-simple-select-outlined-label">Select Layer</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            onChange={({ target: { value } }) => {
              setLayerName(value)
              // if (type === 'image') {
              //   setHeight(value.height)
              //   setWidth(value.width)
              // }

            }}
            value={layerName}
            placeholder="Select Layer"
            label="Select Layer"
          >

            {fieldsSelector()}
          </Select>
        </FormControl>

        {renderInputForm(type)}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggleDialog(false)} color="primary">
          Cancel
      </Button>
        <Button onClick={handleFieldSubmit} color="primary" children={props.editField ? "Edit" : "Add Field"} />
      </DialogActions>
    </Dialog >

  );
};
