import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Slide, Box,
  Slider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  AddBoxOutlined,
  Close,
  IndeterminateCheckBoxOutlined,
} from "@material-ui/icons";
import { createImage, getCroppedImg, getDiagonalLengthOfRectangle } from "helpers/CreateImage";
import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    height: 70,
  },
  button: {
    position: "absolute",
    right: 15,
  },
}));
const cropAreaHeight = window.innerHeight - 100
export default ({ image, cropSize, setIsCropperOpen, onUpload, onCancel }) => {
  const classes = useStyles();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [minZoom, setMinZoom] = useState(0.1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleSave = async () => {
    onUpload(await getCroppedImg(image, croppedAreaPixels, rotation, cropSize));
  };
  // ratio=w/h 
  const ratio = parseInt(`${cropSize?.width ?? 100}`, 10) / parseInt(`${cropSize?.height ?? 100}`)
  let cropperHeight = cropAreaHeight
  let cropperWidth = ratio * cropperHeight
  // if width is greater then max width then set the with to max
  cropperWidth = (window.innerWidth - 30) < cropperWidth ? (window.innerWidth - 30) : cropperWidth
  // and adjust height as per the updated width
  cropperHeight = cropperWidth / ratio
  useEffect(() => {
    // handleCropperInit()
  }, [])

  const handleCropperInit = async () => {
    const imageData = await createImage(image)

    const finalImageDimension = getDiagonalLengthOfRectangle({
      height: parseInt(`${cropSize?.height ?? imageData?.height}`),
      width: parseInt(`${cropSize?.width ?? imageData?.width}`)
    })
    const imageDimension = getDiagonalLengthOfRectangle({ height: imageData?.height, width: imageData?.width })
    const greaterDiagonal = Math.max(finalImageDimension, imageDimension)
    const smallerDiagonal = Math.min(finalImageDimension, imageDimension)
    const value = greaterDiagonal / smallerDiagonal
    setZoom(value)
    // setMinZoom(value)
  }
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
                min={minZoom}
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
      <Box style={{ position: 'relative', background: '#333', height: window.innerHeight - 70 }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={5}
          onRotationChange={setRotation}
          rotation={rotation}
          restrictPosition={false}
          aspect={ratio}
          cropSize={{ width: cropperWidth, height: cropperHeight }}//TODO
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
    </Dialog>
  );
};
