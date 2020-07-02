import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import FileUploader from "components/FileUploader";

export default ({ initialValue, onSubmit, handleEdit }) => {
  const actionName = Object.keys(initialValue)[0];
  const actionValue = initialValue[actionName];
  const [compress, setCompress] = useState(
    actionName === "compress"
      ? actionValue
      : {
          module: "@nexrender/action-encode",
          preset: null,
          output: "encoded.mp4",
        }
  );
  const [watermark, setWaterMark] = useState(
    actionName === "addWaterMark"
      ? actionValue
      : {
          module: "action-watermark",
          input: "encoded.mp4",
          watermark: null,
          output: "watermarked.mp4",
        }
  );
  const [upload, setUpload] = useState(
    actionName === "upload"
      ? actionValue
      : {
          module: "@nexrender/action-upload",
          input: "encoded.mp4",
          provider: "s3",
          params: {
            region: "us-east-1",
            bucket: "bulaava-assets",
            key: `outputs/${Date.now()}.mp4`,
            //TODO better acl policy
            acl: "public-read",
          },
        }
  );
  const [mergeVideos, setMergeVideos] = useState(
    actionName === "mergeVideos"
      ? actionValue
      : {
          module: "action-mergeVideos",
          input: "encoded.mp4",
          f1: ".mp4",
          input1: "",
          f2: "",
          output: "",
        }
  );
  const [addAudio, setAddAudio] = useState(
    actionName === "action-addAudio"
      ? actionValue
      : {
          module: "action-addAudio",
          inputV: "encoded.mp4",
          inputA: "",
          output: "",
        }
  );

  const [fileError, setFileError] = useState(null);
  const [action, setAction] = useState(actionName);

  const renderCompress = () => {
    return (
      <>
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel id="property-select">Preset</InputLabel>

          <Select
            labelId="property-select"
            id="property-select"
            onChange={(e) => {
              setCompress({ ...compress, preset: e?.target?.value });
              handleEdit({
                compress: { ...compress, preset: e?.target?.value },
              });
            }}
            name="property"
            value={compress.preset}
            placeholder="Select Preset"
            label="Preset">
            {presets.map((item, index) => (
              <MenuItem
                key={index}
                id={index}
                value={item}
                children={item}
                selected={compress.preset === item}
              />
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={compress.output}
          onChange={(e) => {
            setCompress({ ...compress, output: e.target.value });
            handleEdit({ compress: { ...compress, output: e?.target?.value } });
          }}
          type="text"
          label={"Output"}
          placeholder={"Enter Output filename"}
        />
      </>
    );
  };
  const renderUpload = () => {
    return (
      <>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={upload.input}
          onChange={(e) => {
            setUpload({ ...upload, input: e.target.value });
            handleEdit({ upload: { ...upload, input: e?.target?.value } });
          }}
          type="text"
          label={"Input"}
          placeholder={"Enter Input filename"}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={upload.params.key}
          onChange={(e) => {
            setUpload({
              ...upload,
              params: { ...upload.params, key: e.target.value },
            });
            handleEdit({
              upload: {
                ...upload,
                params: { ...upload.params, key: e.target.value },
              },
            });
          }}
          type="text"
          label={"S3 File Name"}
          placeholder={"Enter filename"}
          helperText={
            "use examplePath/ before the name for uploading inside the directory"
          }
        />
      </>
    );
  };
  const renderWatermark = () => {
    return (
      <>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={watermark.input}
          onChange={(e) => {
            setWaterMark({ ...watermark, input: e.target.value });
            handleEdit({
              watermark: { ...watermark, input: e?.target?.value },
            });
          }}
          type="text"
          label={"Input"}
          placeholder={"Enter Input filename"}
        />
        <FileUploader
          name={"watermarkFile"}
          value={watermark.watermark}
          onError={(e) => setFileError(e.message)}
          onChange={(url) => {
            setWaterMark({ ...watermark, watermark: url });
            handleEdit({ watermark: { ...watermark, watermark: url } });
          }}
          accept={"image/*"}
          uploadDirectory={"watermarks"}
          label="Watermark"
          onTouched={() => setFileError(null)}
          error={fileError}
          helperText={"Watermark should be transparent."}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={watermark.output}
          onChange={(e) => {
            setWaterMark({ ...watermark, output: e.target.value });
            handleEdit({
              watermark: { ...watermark, output: e?.target?.value },
            });
          }}
          type="text"
          label={"Output"}
          placeholder={"Enter Output filename"}
        />
      </>
    );
  };
  const renderMergeVideos = () => {
    return (
      <>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={mergeVideos.input}
          onChange={(e) => {
            const f1 = e?.target?.value.substr(
              e?.target?.value.lastIndexOf(".")
            );
            setMergeVideos({ ...mergeVideos, input: e.target.value.f1 });
            handleEdit({
              mergeVideos: { ...mergeVideos, f1, input: e?.target?.value },
            });
          }}
          type="text"
          label={"Input"}
          placeholder={"Enter Input filename"}
        />
        <FileUploader
          value={mergeVideos.input1}
          onError={(e) => setFileError(e.message)}
          onChange={(url) => {
            const f2 = url.substr(url.lastIndexOf("."));
            setMergeVideos({ ...mergeVideos, input1: url, f2 });
            handleEdit({ mergeVideos: { ...mergeVideos, input1: url, f2 } });
          }}
          accept={"video/*"}
          fieldName={"input1"}
          label="Video File To be Merged"
          onTouched={() => setFileError(null)}
          error={fileError}
          helperText={"Choose Video to be merged"}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={mergeVideos.output}
          onChange={(e) => {
            setMergeVideos({ ...mergeVideos, output: e.target.value });
            handleEdit({
              mergeVideos: { ...mergeVideos, output: e?.target?.value },
            });
          }}
          type="text"
          label={"Output"}
          placeholder={"Enter Output filename"}
        />
      </>
    );
  };
  const renderAddAudio = () => {
    return (
      <>
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={addAudio.inputV}
          onChange={(e) => {
            setAddAudio({ ...addAudio, inputV: e.target.value });
            handleEdit({ addAudio: { ...addAudio, inputV: e?.target?.value } });
          }}
          type="text"
          label={"Input"}
          placeholder={"Enter Input filename"}
        />
        <FileUploader
          value={addAudio.addAudio}
          onError={(e) => setFileError(e.message)}
          onChange={(url) => {
            setAddAudio({ ...addAudio, inputA: url });
            handleEdit({ addAudio: { ...addAudio, inputA: url } });
          }}
          accept={"audio/*"}
          fieldName={"inputA"}
          label="Audio File"
          onTouched={() => setFileError(null)}
          error={fileError}
          helperText={"Choose Audio file."}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="dense"
          value={addAudio.output}
          onChange={(e) => {
            setAddAudio({ ...addAudio, output: e.target.value });
            handleEdit({ addAudio: { ...addAudio, output: e?.target?.value } });
          }}
          type="text"
          label={"Output"}
          placeholder={"Enter Output filename"}
        />
      </>
    );
  };
  const presets = ["mp4", "ogg", "webm", "mp3", "m4a", "gif"];
  const actions = {
    compress: renderCompress(),
    upload: renderUpload(),
    addWaterMark: renderWatermark(),
    mergeVideos: renderMergeVideos(),
    addAudio: renderAddAudio(),
  };

  return (
    <>
      <FormControl fullWidth margin="dense" variant="outlined">
        <InputLabel id="property-select">Action Name</InputLabel>

        <Select
          labelId="property-select"
          id="property-select"
          onChange={(e) => setAction(e?.target?.value)}
          name="property"
          value={actionName}
          placeholder="Select Action"
          label="Action Name">
          {Object.keys(actions).map((item, index) => (
            <MenuItem
              key={index}
              id={index}
              value={item}
              children={item}
              selected={actionName === item}
            />
          ))}
        </Select>
      </FormControl>
      {actions[action]}
    </>
  );
};
