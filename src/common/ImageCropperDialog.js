import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  makeStyles,
  Slide,
  Slider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  AddBoxOutlined,
  Close,
  IndeterminateCheckBoxOutlined,
} from "@material-ui/icons";
import { getCroppedImg } from "helpers/CreateImage";
import React, { useState } from "react";
import Cropper from "react-easy-crop";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  button: {
    position: "absolute",
    right: 15,
  },
}));

export default ({ image, cropSize, setIsCropperOpen, onUpload, onCancel }) => {
  const classes = useStyles();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2.5);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleSave = async () => {
    onUpload(await getCroppedImg(image, croppedAreaPixels, rotation));
  };
  return (
    <Dialog
      open
      fullScreen
      TransitionComponent={Transition}
      onClose={() => setIsCropperOpen(false)}
      aria-labelledby="form-dialog-title">
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onCancel}
            aria-label="close">
            <Close />
          </IconButton>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: "auto",
            }}>
            {" "}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: 200,
                marginTop: 0,
                marginBottom: 0,
                margin: 20,
              }}>
              <Typography id="Zoom" gutterBottom>
                Zoom
              </Typography>

              <IndeterminateCheckBoxOutlined
                style={{
                  color: "white",
                  fontSize: 25,
                  padding: 5,
                  paddingBottom: 0,
                  paddingTop: 0,
                }}
              />
              <Slider
                style={{ marginLeft: 5, color: "white" }}
                value={zoom}
                min={0.5}
                max={5}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom)}
              />
              <AddBoxOutlined
                color="inherit"
                style={{
                  fontSize: 25,
                  padding: 5,
                  paddingBottom: 0,
                  paddingTop: 0,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                width: 200,
                marginTop: 0,
                marginBottom: 0,
                margin: 20,
              }}>
              <Typography id="Zoom" gutterBottom>
                Rotate
              </Typography>
              <IndeterminateCheckBoxOutlined
                color="inherit"
                style={{
                  fontSize: 25,
                  padding: 5,
                  paddingBottom: 0,
                  paddingTop: 0,
                }}
              />
              <Slider
                style={{ marginLeft: 5, color: "white" }}
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Zoom"
                onChange={(e, degree) => setRotation(degree)}
              />
              <AddBoxOutlined
                color="inherit"
                style={{
                  fontSize: 25,
                  padding: 5,
                  paddingBottom: 0,
                  paddingTop: 0,
                }}
              />
            </div>
          </div>
          <Button
            className={classes.button}
            autoFocus
            color="inherit"
            onClick={handleSave}
            children="Upload"
          />
        </Toolbar>
      </AppBar>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        minZoom={0.5}
        maxZoom={5}
        onRotationChange={setRotation}
        rotation={rotation}
        restrictPosition={false}
        cropSize={cropSize}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </Dialog>
  );
};
