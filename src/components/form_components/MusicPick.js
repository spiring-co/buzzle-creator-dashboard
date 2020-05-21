import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { BodyText } from "../Typography";

// TODO redo as a S3 upload component
export default ({ label, required, name, value, defaultValue, onChange }) => {
  let [audio, setAudio] = useState(
    new Audio(value !== null ? value : defaultValue)
  );
  let [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const toggle = () => setIsPlaying(!isPlaying);

  let [progress, setProgress] = useState(0);
  let [uploading, setUploading] = useState(false);

  useEffect(() => {
    onChange(label, name, defaultValue, required);
    isPlaying ? audio.play() : audio.pause();
    return function () {
      audio.pause();
    };
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [audio]);

  const pickMusic = async (e) => {
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsPlaying(false);
        setAudio(new Audio(e.target.result));
      };
      reader.readAsDataURL(file);

      setUploading(true);
      const uri = await uploadMusic(file);
      console.log(uri);
      onChange(label, name, uri, required);
      setUploading(false);
    } catch (err) {
      setError(err);
      setAudio(audio);
    }
  };

  const uploadMusic = async (f) => {
    const formData = new FormData();
    formData.append("file", f);
    const response = await fetch("https://create.bulaava.in/upload_music", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return await response.text();
  };

  const icon = require(`assets/${isPlaying ? "pause" : "play"}.svg`);

  return (
    <div>
      <Player onClick={toggle}>
        <Icon src={icon} />
        <BodyText>{isPlaying ? "Pause" : "Play"}</BodyText>
      </Player>
      <label style={{ display: "block", textAlign: "center" }}>
        <Button disabled={uploading}>
          {uploading ? "Uploading..." : "CHANGE MUSIC"}
        </Button>
        <input
          id={name}
          style={{ display: "none" }}
          type="file"
          name={name}
          accept="audio/*"
          onChange={pickMusic}
        />
      </label>

      {error && <ErrorText>{error.message}</ErrorText>}
    </div>
  );
};

const Icon = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 20%;
`;

const Player = styled.div`
  cursor: pointer;
  text-align: center;
  margin: auto;
  border: 2px solid #e3e3e3;
  border-radius: 20px;
  height: 120px;
  width: 120px;
`;

const Button = styled(BodyText)`
  font-weight: bold;
  text-align: center;
  display: block;
`;

const ErrorText = styled(BodyText)`
  color: red;
`;
