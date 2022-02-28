import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import React from "react";

export default ({
  composition,
  setComposition,
  compositions,
  openVersionMeta,
}) => {
  return (
    <form
      style={{
        display: "flex",

        alignItems: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <FormControl style={{ width: 400 }} margin="dense" variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">
          Select Composition
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          onChange={(e) => setComposition(e.target.value)}
          value={composition}
          placeholder="Select Composition"
          label="Select Composition">
          {Object.keys(compositions).length === 0 && (
            <MenuItem disabled={true}>No Compositions Found:(</MenuItem>
          )}
          {Object.keys(compositions).map((item, index) => {
            return (
              <MenuItem key={index} id={index} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        style={{ marginLeft: 10 }}
        color={"primary"}
        variant="outlined"
        onClick={() => openVersionMeta()}
        disabled={composition === ""}
        children={composition ? "Next" : "Add"}
      />
    </form>
  );
};
