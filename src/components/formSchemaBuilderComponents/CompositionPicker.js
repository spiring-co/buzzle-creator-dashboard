import React from "react";
import { Button, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
export default ({ comp_name, setComp_name, compositions, openVersionMeta }) => {
  return (
    <form
      style={{
        display: 'flex',

        alignItems: 'center'
      }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormControl
        style={{ width: 400 }}
        margin="dense"
        variant="outlined"
      >
        <InputLabel id="demo-simple-select-outlined-label">Select Composition</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          onChange={(e) => setComp_name(e.target.value)}
          value={comp_name}
          placeholder="Select Composition"
          label="Select Composition"
        >
          {Object.keys(compositions).length === 0 &&
            <MenuItem disabled={true}>
              No Compositions Found:(
          </MenuItem>}
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
        disabled={comp_name === ""}
        children="Add"
      />



    </form>
  );
};
