import { Chip, TextField } from "@material-ui/core";
import React, { useState } from "react";

export default ({
  disabled,
  onChange,
  keywords,
  placeholder = "Enter Value",
  label = "Value",
  maxKeywords,
  variant = "outlined",
}) => {
  const [tagInput, setTagInput] = useState("");
  const handleTagInput = (value) => {
    if (
      (value.substr(-1) === "," || value.substr(-1) === " ") &&
      value.substr(0, 1) !== " " &&
      value.substr(0, 1) !== ","
    ) {
      onChange([...keywords, value.substr(0, value.length - 1)]);
      setTagInput("");
    } else {
      setTagInput(value);
    }
  };
  const handleDelete = (tagValue) => {
    // delete the tag
    onChange(keywords.filter((tag) => tag !== tagValue));
  };
  return (
    <TextField
      fullWidth
      margin={"dense"}
      disabled={
        disabled
          ? disabled
          : maxKeywords
          ? keywords.length >= maxKeywords
          : false
      }
      variant={variant}
      onChange={({ target: { value } }) => handleTagInput(value)}
      value={tagInput}
      type="text"
      placeholder={placeholder}
      label={label}
      error={
        (maxKeywords && keywords.length > maxKeywords) ||
        tagInput.substr(0, 1) === " " ||
        tagInput.substr(0, 1) === ","
      }
      helperText={
        tagInput.substr(0, 1) === " " || tagInput.substr(0, 1) === ","
          ? "Invalid Keyword Value"
          : maxKeywords
          ? `You can add maximum of ${maxKeywords} keywords`
          : ""
      }
      InputProps={{
        startAdornment: keywords.map((tag, index) => {
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
    />
  );
};
