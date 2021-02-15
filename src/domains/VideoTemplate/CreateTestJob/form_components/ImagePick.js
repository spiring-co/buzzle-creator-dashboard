import React, { useEffect, useState } from "react";
import { storage, uploadFile } from "services/firebase";
import { Modal } from "react-responsive-modal";
import styled from "styled-components";
import ReactCrop, { makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default ({ size, preview = null, fieldValue, name = "" }) => {
  const [imageUploadedPercent, setImageUploadedPercent] = useState(0);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 200 / 200 });
  const [uploaded, setUploaded] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setPreviewImage(preview);
  }, [name]);

  useEffect(() => {
    console.log(size);
    setCrop({ aspect: size.width / size.height });
  }, []);

  const handleChangeImage = async (file, field) => {
    console.log(file, field);
    const path = await uploadFile(file, (task) =>
      task.on("state_changed", ({ bytesTransferred, totalBytes }) =>
        setImageUploadedPercent(bytesTransferred / totalBytes)
      )
    );
    try {
      return storage
        .ref()
        .child(path)
        .getDownloadURL()
        .then((value) => {
          console.log(field, value);
          fieldValue(field, value);
          setPreviewImage(value);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(uploaded);
  }, [uploaded]);

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files.length) {
      setUploaded(true);
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getCroppedImg = (e) => {
    e.preventDefault();
    console.log(image);
    console.log(crop);
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    console.log(scaleX, scaleY);
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    var canvasTemp = document.createElement("canvas");
    var ctx2 = canvasTemp.getContext("2d");
    canvasTemp.width = size.width;
    canvasTemp.height = size.height;
    ctx2.drawImage(canvas, 0, 0, size.width, size.height);

    const base64Image = canvasTemp.toDataURL("image/jpeg");
    console.log(base64Image);
    canvasTemp.toBlob((blob) => {
      console.log(blob);
      handleChangeImage(blob, name);
    });
    setUploaded(false);
  };

  const onCloseModal = () => {
    setUploaded(false);
  };

  return (
    <div style={{ display: "flex ", flexDirection: "column" }}>
      {previewImage ? <Icon src={previewImage}></Icon> : <div></div>}
      <input
        type={"file"}
        name=""
        style={{ width: 95, margin: 10 }}
        id="img"
        accept="image/x-png,image/gif,image/jpeg"
        // onChange={(e) => handleChangeImage(e, e.target.files[0], name)}
        onChange={handleFileChange}
      />
      <Modal
        open={uploaded}
        onClose={onCloseModal}
        style={{ height: 1400, width: 1000 }}
      >
        <div>
          <ReactCrop
            src={file}
            crop={crop}
            onChange={setCrop}
            onImageLoaded={setImage}
          />
          <button onClick={getCroppedImg}>Crop</button>
        </div>
      </Modal>
      {/* {result && (
        <div>
          <img src={result} alt="Cropped image" />
        </div>
      )} */}
      <div>
        {imageUploadedPercent === 0 ? (
          ""
        ) : (
          <div style={{ display: "flex" }}>
            {`${"uploading"} - ${Math.floor(imageUploadedPercent * 100)}%`}
          </div>
        )}
      </div>
    </div>
  );
};

const Icon = styled.img`
  height: 100px;
  width: 100px;
  margin-right: 4%;
  border-radius: 20px;
  border: 2px solid #e3e3e3;
`;

const ImageHolder = styled.div`
  text-align: center;
  margin: auto;
  border: 2px solid #e3e3e3;
  border-radius: 20px;
  height: 120px;
  width: 120px;
  background-color: #e3e3e3;
`;
