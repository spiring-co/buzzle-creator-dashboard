import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import FontUploader from "./formSchemaBuilderComponents/FontUploader";

export default ({ initialValue, onSubmit, handleEdit }) => {
  const actionName = Object.keys(initialValue)[0];
  const actionValue = initialValue[actionName];
  const [action, setAction] = useState(actionName);
  const [fonts, setFonts] = useState(
    actionName === "installFonts"
      ? actionValue
      : {
          module: "action-install-fonts",
          fonts: [{ name: "", src: "" }],
        }
  );
  const renderFontInstall = () => {
    return (
      <>
        {fonts.fonts.map((font, index) => (
          <FontUploader
            font={font}
            handleDelete={() => handleDelete(index)}
            setFont={(value) => handleFontInput(index, value)}
          />
        ))}
      </>
    );
  };
  const actions = {
    installFonts: renderFontInstall(),
  };
  const handleAddFont = () => {
    fonts.fonts.push({ name: "", src: "" });
    setFonts({ ...fonts, fonts: fonts.fonts });
    handleEdit({ installFonts: { ...fonts, fonts: fonts.fonts } });
  };

  const handleFontInput = (index, value) => {
    fonts.fonts[index] = value;
    setFonts({ ...fonts, fonts: fonts.fonts });
    handleEdit({ installFonts: { ...fonts, fonts: fonts.fonts } });
  };
  const handleDelete = (index) => {
    // delete the font
    const temp = fonts.fonts.filter((font, i) => index !== i);
    setFonts({ ...fonts, fonts: temp });
    handleEdit({ installFonts: { ...fonts, fonts: temp } });
  };
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddFont}
        children={"Add Font"}
      />

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
