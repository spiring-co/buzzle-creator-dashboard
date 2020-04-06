import { BodyText } from "../Typography";
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import ReactCrop from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

export default ({ name, label, onChange, required, size, value }) => {
  let [image, setImage] = useState(value);
  const [isLightBoxVisible, setIsLightBoxVisible] = useState(false);
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [previewUrl, setPreviewUrl] = useState();
  let [progress, setProgress] = useState(0);
  let [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const pickImage = async (e) => {
    try {
      const file = e.target.files[0];

      // TODO Implement cropper here

      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);

      setUploading(true);
      const uri = await uploadImage(file);
      console.log(uri);
      onChange(label, name, uri, required);
      setUploading(false);
    } catch (err) {
      setError(err);
    }
  };

  const uploadImage = async (f) => {
    const formData = new FormData();
    formData.append("file", f);
    const response = await fetch("https://create.bulaava.in/upload_image", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return await response.text();
  };

  useEffect(() => {
    onChange(label, name, value !== null ? value : " ", required);
  }, []);

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const makeClientCrop = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, "newFile.jpeg");
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
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

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(window.URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleClear = (e) => {
    setImage(value);
    setImgRef(null);
    setCrop({ unit: "%", width: 30, aspect: 16 / 9 });
    setPreviewUrl();
    alert("you image is uploded");
  };

  const icon = require("../../assets/image.svg");

  return (
    <section>
      <div>
        <ImageHolder
          onClick={image ? () => setIsLightBoxVisible(true) : null}
          style={{
            background: `center / contain no-repeat url(${previewUrl})`,
          }}
        >
          {!image && (
            <>
              <Icon src={icon} />
              <BodyText>{label}</BodyText>
            </>
          )}
        </ImageHolder>
        <label style={{ display: "block", textAlign: "center" }} for={name}>
          <Button>{image ? "CHANGE" : "PICK IMAGE"}</Button>
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          name={name}
          id={name}
          accept="image/*"
          onChange={pickImage}
        />
        {image && (
          <ReactCrop
            src={image}
            onImageLoaded={onLoad}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={makeClientCrop}
          />
        )}

        <LightBox
          style={{ display: isLightBoxVisible ? "block" : "none" }}
          onClick={() => setIsLightBoxVisible(false)}
          src={image}
          alt={name}
        />
      </div>
    </section>
  );
};

const Icon = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 20%;
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

const Button = styled(BodyText)`
  font-weight: bold;
  text-align: center;
  display: block;
`;

const LightBox = styled.img`
  display: none;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  text-align: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  object-fit: contain;
`;

const ErrorText = styled(BodyText)`
  color: red;
`;
