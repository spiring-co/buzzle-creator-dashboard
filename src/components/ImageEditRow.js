import React, { useState } from 'react'
import {
    RadioGroup,
    FormControl, FormControlLabel, Radio,
    TextField,
} from "@material-ui/core";
import FileUploader from "components/FileUploader"

const imageEditComponent = {
    image: function (value, onChange, uploadDirectory, onError, key) {
        return <FileUploader
            value={value}
            onChange={onChange}
            uploadDirectory={'jobImages'}
            onError={null}
            name={key}
        />
    },
    text: function (value, onChange) {
        return (<TextField
            value={value}
            onChange={(e) => onChange(e?.target?.value)} />)
    }
}
export default ({ onChange, value }) => {
    const [imageEditType, setImageEditType] = useState("image")
    return (<>
        <FormControl component="fieldset" >
            <RadioGroup value={imageEditType} onChange={(e) => setImageEditType(e.target.value)} row>
                <FormControlLabel
                    value="image"
                    control={<Radio />}
                    label="Image"
                    labelPlacement="end"
                /><FormControlLabel
                    value="text"
                    control={<Radio />}
                    label="URL"
                    labelPlacement="end"
                />
            </RadioGroup>
        </FormControl>
        {imageEditComponent[imageEditType](value, onChange, 'jobImages', null, Date.now())}
    </>)
}