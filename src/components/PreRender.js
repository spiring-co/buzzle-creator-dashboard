import React, { useState } from 'react'
import { Button, TextField, Chip, FormHelperText } from "@material-ui/core";

export default ({ initialValue, onSubmit, handleEdit }) => {
    const actionName = Object.keys(initialValue)[0]
    const actionValue = initialValue[actionName]
    const [fontInput, setFontInput] = useState("")
    const [fonts, setFonts] = useState(actionName === 'installFonts' ? actionValue : {
        module: 'install-fonts',
        fonts: []
    })


    const handleFontInput = (value) => {
        if (
            (value.substr(-1) === "," || value.substr(-1) === " ") &&
            value.substr(0, 1) !== " " &&
            value.substr(0, 1) !== ","
        ) {
            setFonts({ ...fonts, fonts: [...fonts.fonts, value.substr(0, value.length - 1)] });
            handleEdit({ installFonts: { ...fonts, fonts: [...fonts.fonts, value.substr(0, value.length - 1)] } })
            setFontInput("");
        } else {
            setFontInput(value);
        }
    };
    const handleDelete = (fontValue) => {
        // delete the font
        setFonts({ ...fonts, fonts: fonts.fonts.filter((font) => font !== fontValue) });
        handleEdit({ installFonts: { ...fonts, fonts: fonts.fonts.filter((font) => font !== fontValue) } })

    };
    return (<>
        <TextField
            fullWidth
            margin={"dense"}
            variant={"outlined"}
            onChange={({ target: { value } }) => handleFontInput(value)}
            value={fontInput}
            type="text"
            placeholder="Enter font Name"
            label="Fonts"
            error={

                fontInput.substr(0, 1) === " " ||
                fontInput.substr(0, 1) === ","
            }
            helperText={
                fontInput.substr(0, 1) === " " || fontInput.substr(0, 1) === ","
                && "Invalid Font Value"
            }
            InputProps={{
                startAdornment: <div style={{ display: 'flex', flexWrap: "wrap", flexDirection: 'row' }}>
                    {fonts.fonts.map((font, index) => {
                        return (
                            <Chip
                                key={index}
                                style={{ margin: 6 }}
                                size="small"
                                label={font}
                                onDelete={() => handleDelete(font)}
                            />
                        );
                    })
                    }
                </div>
            }}
        /></>)
}