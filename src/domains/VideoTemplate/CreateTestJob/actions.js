import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { storage, uploadFile } from "../../services/firebase";
import Colors from "./constants/Colours";

import { HeaderText } from "./Typography";
//https://www.npmjs.com/package/react-easy-crop

export default ({
  initialActions = {},
  onChange,
  isMergeVideosActionAvailable = true,
  showFullHD = false,
}) => {
  const [uploadedPercent, setUploadedPercent] = useState(0);
  const [video, setVideo] = useState(
    initialActions?.postrender?.find(
      ({ module }) => module === "action-merge-videos"
    )?.input2 ?? null
  );

  const watermark = initialActions?.postrender?.find(
    ({ module }) => module === "action-watermark"
  );

  const [music, setMusic] = useState(
    initialActions?.postrender?.find(
      ({ module }) => module === "action-add-audio"
    )?.audio ?? ""
  );
  const [openingVideos, setOpeningVideos] = useState([]);

  useEffect(() => {
    setOpeningVideos(JSON.parse(localStorage.getItem("openingVideos")));
  }, []);

  useEffect(() => {
    console.log(getActions());
    onChange(getActions());
  }, [music, video]);

  const getActions = () => {
    return {
      postrender: [
        {
          ...(watermark ? watermark : {}),
        },
        {
          ...(video
            ? {
                module: "action-merge-videos",
                input2: video,
              }
            : {}),
        },
        {
          ...(music
            ? {
                module: "action-add-audio",
                audio: music,
              }
            : {}),
        },
      ].filter((v) => Object.keys(v)?.length !== 0),
    };
  };

  const handleChangeMusic = async (file) => {
    try {
      const filename = await uploadFile(file, (task) =>
        task.on("state_changed", ({ bytesTransferred, totalBytes }) =>
          setUploadedPercent(bytesTransferred / totalBytes)
        )
      );

      return storage.ref().child(filename).getDownloadURL().then(setMusic);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", paddingBottom: 100 }}
      >
        <HeaderText>Change Music</HeaderText>
        <input
          style={{ fontWeight: "bold", textAlign: "center", display: "block" }}
          type={"file"}
          defaultValue={""}
          onChange={(e) => {
            e.preventDefault();
            handleChangeMusic(e.target.files[0]);
          }}
          name={"music"}
          accept=".mp3"
        />
        {uploadedPercent === 0 ? (
          ""
        ) : (
          <div style={{ display: "flex" }}>
            {`${"uploading"} - ${Math.floor(uploadedPercent * 100)}%`}
            <button
              onClick={() => {
                setMusic("");
                setUploadedPercent(0);
              }}
              style={{ width: 105 }}
            >
              remove audio
            </button>
            <ReactAudioPlayer src={music} controls />
          </div>
        )}
        {isMergeVideosActionAvailable ? (
          <div>
            <HeaderText>Starting Video</HeaderText>
            <select
              onChange={(e) => {
                setVideo(e.target.value);
              }}
            >
              {openingVideos
                ?.map(({ title: label, sd, hd }, i) => ({
                  label,
                  value: showFullHD ? hd : sd,
                }))
                .map(({ label, value }) => {
                  return <option value={value}> {label}</option>;
                })}
            </select>
          </div>
        ) : (
          <div></div>
        )}
        <div style={styles.spacing} />
      </div>
    </>
  );
};

const styles = {
  submitButton: {
    position: "absolute",
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    elevation: 5,
  },

  container: {
    elevation: 4,
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginLeft: 5,
    marginRight: 5,
    padding: 20,
  },

  pickerStyle: {
    inputIOS: {
      color: Colors.black,
      height: 50,
      fontSize: 18,
      paddingLeft: 6,
      marginLeft: 16,
      marginRight: 16,
      marginTop: 13,
      marginBottom: 13,
      fontWeight: "bold",
      fontFamily: "poppins",
      borderBottomColor: Colors.borderColor,
      borderBottomWidth: 1, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      color: Colors.black,
      fontFamily: "poppins",
      fontWeight: "normal",
      fontSize: 18,
      borderBottomColor: Colors.borderColor,
      borderBottomWidth: 1, // to ensure the text is never behind the icon
    },
    placeholder: {
      color: Colors.placeHolderText,
      fontFamily: "poppins",
    },
  },

  customizingText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: "poppins",
    color: "#808080",
  },
  spacing: { height: 200, width: "100%" },
};
