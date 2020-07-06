

import React, { useState } from 'react'
import { Button, TextField, Chip, FormHelperText } from "@material-ui/core";


export default ({ disabled,
    onChange,
    tags,
    placeholder = "Enter Tags",
    label = "Tags",
    maxTags,
    variant = "outlined"
}) => {
    const [tagInput, setTagInput] = useState("")
    const handleTagInput = (value) => {
        if (
            (value.substr(-1) === "," || value.substr(-1) === " ") &&
            value.substr(0, 1) !== " " &&
            value.substr(0, 1) !== ","
        ) {
            onChange([...tags, value.substr(0, value.length - 1)]);
            setTagInput("");
        } else {
            setTagInput(value);
        }
    };
    const handleDelete = (tagValue) => {
        // delete the tag
        onChange(tags.filter((tag) => tag !== tagValue));
    };
    return (<TextField
        fullWidth
        margin={"dense"}
        disabled={disabled ? disabled : maxTags ? tags.length >= maxTags : false}
        variant={variant}
        onChange={({ target: { value } }) => handleTagInput(value)}
        value={tagInput}
        type="text"
        placeholder={placeholder}
        label={label}
        error={
            (maxTags && tags.length > maxTags) ||
            tagInput.substr(0, 1) === " " ||
            tagInput.substr(0, 1) === ","
        }
        helperText={
            tagInput.substr(0, 1) === " " || tagInput.substr(0, 1) === ","
                ? "Invalid Tag Value"
                : maxTags ? `You can add maximum of ${maxTags} tags` : ""
        }
        InputProps={{
            startAdornment: tags.map((tag, index) => {
                return (
                    <Chip
                        key={index}
                        style={{ margin: 6 }}
                        size="small"
                        label={tag}
                        onDelete={() => handleDelete(tag)}
                    />
                );
            }),
        }}
    />)
}