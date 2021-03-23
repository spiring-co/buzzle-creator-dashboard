import React, { useState } from "react";
import { TextField } from "@material-ui/core";

export default ({ maxLength, value, onChange }) => {
  const [charsLeft, setCharsLeft] = useState(value.length);
  const handleChangeInput = (e) => {
    console.log(e.target.value);
    var input = e.target.value;
    onChange(e.target.value);
    setCharsLeft(maxLength - input.length);
  };
  return (
    <div>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => handleChangeInput(e)}
      />
      <text>{charsLeft + " / " + maxLength}</text>
    </div>
  );
};
