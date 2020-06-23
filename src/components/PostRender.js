import React, { useState } from 'react'
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
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
} from "@material-ui/core";
import FileUploader from 'components/FileUploader'

export default ({ initialValue, onSubmit, handleEdit }) => {
    const actionName = Object.keys(initialValue)[0]
    const actionValue = initialValue[actionName]
    const [compress, setCompress] = useState(actionName === "compress" ? actionValue : {
        module: "@nexrender/action-encode",
        preset: null,
        output: "encoded.mp4",
    })
    const [watermark, setWaterMark] = useState(actionName === "addWaterMark" ? actionValue : {
        module: 'action-watermark',
        input: 'encoded.mp4',
        watermark: null,
        output: "watermarked.mp4"
    })
    const [upload, setUpload] = useState(actionName === 'upload' ? actionValue : {
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
    })
    const [fileError, setFileError] = useState(null)
    const [action, setAction] = useState(actionName)

    const renderCompress = () => {
        return <>
            <FormControl
                fullWidth
                margin="dense"
                variant="outlined"
            >
                <InputLabel id="property-select">Preset</InputLabel>

                <Select
                    labelId="property-select"
                    id="property-select"
                    onChange={(e) => {
                        setCompress({ ...compress, preset: e?.target?.value })
                        handleEdit({ compress: { ...compress, preset: e?.target?.value } })
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
                    setCompress({ ...compress, output: e.target.value })
                    handleEdit({ compress: { ...compress, output: e?.target?.value } })

                }}
                type="text"
                label={"Output"}
                placeholder={"Enter Output filename"}
            />
        </>

    }
    const renderUpload = () => {
        return <>
            <TextField
                fullWidth
                fullWidth
                variant="outlined"
                margin="dense"
                value={upload.input}
                onChange={(e) => {
                    setUpload({ ...upload, input: e.target.value })
                    handleEdit({ upload: { ...upload, input: e?.target?.value } })

                }}
                type="text"
                label={"Input"}
                placeholder={"Enter Input filename"}
            />
            <TextField
                fullWidth
                fullWidth
                variant="outlined"
                margin="dense"
                value={upload.params.key}
                onChange={(e) => {
                    setUpload({ ...upload, params: { ...upload.params, key: e.target.value } })
                    handleEdit({ upload: { ...upload, params: { ...upload.params, key: e.target.value } } })

                }}
                type="text"
                label={"S3 File Name"}
                placeholder={"Enter filename"}
                helperText={"use examplePath/ before the name for uploading inside the directory"}
            />
        </>

    }
    const renderWatermark = () => {
        return <>
            <TextField
                fullWidth
                fullWidth
                variant="outlined"
                margin="dense"
                value={watermark.input}
                onChange={(e) => {
                    setWaterMark({ ...watermark, input: e.target.value })
                    handleEdit({ watermark: { ...watermark, input: e?.target?.value } })

                }}
                type="text"
                label={"Input"}
                placeholder={"Enter Input filename"}
            />
            <FileUploader
                value={watermark.watermark}
                onError={(e) => setFileError(e.message)}
                onChange={url => {
                    setWaterMark({ ...watermark, watermark: url })
                    handleEdit({ watermark: { ...watermark, watermark: url } })

                }}
                accept={"image/*"}
                fieldName={"watermarks"}
                label="Watermark"
                onTouched={() => setFileError(null)}
                error={fileError}
                helperText={
                    "Watermark should be transparent."
                }
            />
            <TextField
                fullWidth
                fullWidth
                variant="outlined"
                margin="dense"
                value={watermark.output}
                onChange={(e) => {
                    setWaterMark({ ...watermark, output: e.target.value })
                    handleEdit({ watermark: { ...watermark, output: e?.target?.value } })

                }}
                type="text"
                label={"Output"}
                placeholder={"Enter Output filename"}
            />
        </>
    }
    const presets = ["mp4", "ogg", "webm", "mp3", "m4a", "gif"]
    const actions = {
        "compress": renderCompress(), "upload": renderUpload(), "addWaterMark": renderWatermark()
    }

    return (<>
        <FormControl
            fullWidth
            margin="dense"
            variant="outlined"
        >
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
        {actions[action]}</>)
}