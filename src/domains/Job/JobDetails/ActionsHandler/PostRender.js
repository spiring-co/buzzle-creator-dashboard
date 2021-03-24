import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";
import FileUploader from "common/FileUploader";

export default ({ initialValue, onSubmit, handleEdit }) => {
    const actionName = Object.keys(initialValue)[0];
    console.log(initialValue)
    const actionValue = initialValue[actionName];
    const [compress, setCompress] = useState(
        actionName === "compress"
            ? actionValue
            : {
                module: "buzzle-action-handbrake",
                preset: null,
                output: "encoded.mp4",
            }
    );
    const [watermark, setWaterMark] = useState(
        actionName === "addWaterMark"
            ? actionValue
            : {
                module: "buzzle-action-watermark",
                watermark: null,
            }
    );
    const [thumbnail, setThumbnail] = useState(
        actionName === "addThumbnail"
            ? actionValue
            : {
                module: "buzzle-action-add-thumbnail",
                thumbnail: null,
                thumbnailDuration: 1,
            }
    );
    const [upload, setUpload] = useState(
        actionName === "upload"
            ? actionValue
            : {
                module: "buzzle-action-upload",
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
                module: "buzzle-action-merge-videos",
                input2: "",

            }
    );
    const [addAudio, setAddAudio] = useState(
        actionName === "addAudio"
            ? actionValue
            : {
                module: "buzzle-action-add-audio",
                audio: ""
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
            <><FileUploader
                name={"watermarkFile"}
                value={watermark.watermark}
                onError={(e) => setFileError(e.message)}
                onChange={(url) => {
                    setWaterMark({ ...watermark, watermark: url });
                    handleEdit({ addWaterMark: { ...watermark, watermark: url } });
                }}
                accept={"image/*"}
                label="Watermark"
                onTouched={() => setFileError(null)}
                error={fileError}
                helperText={"Watermark should be transparent."}
            />
            </>
        );
    };
    const renderAddThumbnail = () => {
        return <>
            <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                value={thumbnail.thumbnailDuration}
                onChange={(e) => {
                    setThumbnail({ ...thumbnail, thumbnailDuration: e.target.value });
                    handleEdit({ addThumbnail: { ...thumbnail, thumbnailDuration: e?.target?.value } });
                }}
                type="text"
                label={"Thumbnail durationa in frames"}
                placeholder={"Enter duration number"}
            />
            <FileUploader
                name={"thumbnailFile"}
                value={thumbnail.thumbnail}
                onError={(e) => setFileError(e.message)}
                onChange={(url) => {
                    setThumbnail({ ...thumbnail, thumbnail: url });
                    handleEdit({ addThumbnail: { ...thumbnail, thumbnail: url } });
                }}
                accept={"image/*"}
                label="Thumbnail"
                onTouched={() => setFileError(null)}
                error={fileError}
                helperText={"Thumbnail would be resized to fit."}
            />
        </>
    }
    const renderMergeVideos = () => {
        return (
            <>
                <FileUploader
                    value={mergeVideos.input2}
                    onError={(e) => setFileError(e.message)}
                    onChange={(url) => {
                        setMergeVideos({ ...mergeVideos, input2: url, });
                        handleEdit({ mergeVideos: { ...mergeVideos, input2: url, } });
                    }}
                    accept={"video/*"}
                    name={"input2"}
                    label="Video File To be Merged"
                    onTouched={() => setFileError(null)}
                    error={fileError}
                    helperText={"Choose Video to be merged"}
                />
            </>
        );
    };
    const renderAddAudio = () => {
        return (
            <>
                <FileUploader
                    value={addAudio.audio}
                    onError={(e) => setFileError(e.message)}
                    onChange={(url) => {
                        setAddAudio({ ...addAudio, audio: url });
                        handleEdit({ addAudio: { ...addAudio, audio: url } });
                    }}
                    accept={"audio/*"}
                    name={"audio"}
                    label="Audio File"
                    onTouched={() => setFileError(null)}
                    error={fileError}
                    helperText={"Choose Audio file."}
                />
                {addAudio.audio && <audio controls>
                    <source src={addAudio.audio} type="audio/mpeg" />
                </audio>}
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
        addThumbnail: renderAddThumbnail()
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









