import DateFnsUtils from "@date-io/date-fns";
import { Button, Checkbox, TextField } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { VideoTemplate } from "services/api";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default React.memo(
  ({ value = {}, onChange }) => {
    console.log("mounted");
    const [loading, setLoading] = useState(true);
    const [videoTemplates, setVideoTemplates] = useState([]);
    const [filters, setFilters] = useState(value);
    const [selectedTemplates, setSelectedTemplates] = useState(
      value?.idVideoTemplates ?? []
    );
    useEffect(() => {
      videoTemplates.length === 0 &&
        VideoTemplate.getAll(1, 500)
          .then(({ data }) =>
            setVideoTemplates(data.map(({ title, id }) => ({ title, id })))
          )
          .catch(console.log)
          .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
      onChange(filters);
    }, [filters]);
    return (
      <>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{ width: 150, marginBottom: 0 }}
            disableToolbar
            margin="dense"
            format="MM/dd/yyyy"
            id="date-picker-inline"
            label="Start date"
            value={value?.startDate ?? null}
            onChange={(v) =>
              setFilters({ ...filters, startDate: new Date(v).toISOString() })
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="dense"
            style={{
              marginLeft: 10,
              width: 150,
              marginRight: 10,
              marginBottom: 0,
            }}
            disableToolbar
            format="MM/dd/yyyy"
            id="date-picker-inline"
            label="End date"
            value={value?.endDate ?? null}
            onChange={(v) =>
              setFilters({ ...filters, endDate: new Date(v).toISOString() })
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        {/* <FormControl style={{ marginRight: 10, minWidth: 150 }}>
          <InputLabel id="demo-simple-select-label">Video Template</InputLabel>
          <Select
            disabled={loading}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value?.idVideoTemplate}
            onChange={({ target: { value } }) =>
              setFilters({ ...filters, idVideoTemplate: value })
            }>
            {videoTemplates.map(({ title, id }) => (
              <MenuItem value={id}>{title}</MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <Autocomplete
          multiple
          limitTags={1}
          id="checkboxes-tags-demo"
          // onClose={(e, r) => r ? r === 'blur' ?
          //   setFilters({ ...filters, idVideoTemplates: selectedTemplates }) : console.log(r) : setFilters({ ...filters, idVideoTemplates: selectedTemplates })}
          //
          value={value?.idVideoTemplates}
          options={videoTemplates}
          loading={loading}
          onChange={(e, v) => setFilters({ ...filters, idVideoTemplates: v })}
          disableCloseOnSelect
          getOptionLabel={({ title }) => title}
          renderOption={(option) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={value?.idVideoTemplates
                  ?.map(({ id }) => id)
                  .includes(option?.id)}
              />
              {option.title}
            </React.Fragment>
          )}
          style={{ width: 250, marginRight: 10 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Videotemplates"
              placeholder="Choose videotemplates"
            />
          )}
        />
        <Autocomplete
          multiple
          limitTags={1}
          id="checkboxes-tags-demo"
          value={value?.states}
          options={["error", "created", "started", "finished"]}
          onChange={(e, v) => setFilters({ ...filters, states: v })}
          disableCloseOnSelect
          getOptionLabel={(a) => a}
          renderOption={(option) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={value?.states?.includes(option)}
              />
              {option.toUpperCase()}
            </React.Fragment>
          )}
          style={{ width: 250, marginRight: 10 }}
          renderInput={(params) => (
            <TextField {...params} label="Status" placeholder="Select Status" />
          )}
        />
        {/* <FormControl style={{ marginRight: 10, width: 100 }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value?.state}
            onChange={({ target: { value } }) =>
              setFilters({ ...filters, state: value })
            }>
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={"error"}>Error</MenuItem>
            <MenuItem value={"created"}>Created</MenuItem>
            <MenuItem value={"finished"}>Finished</MenuItem>
          </Select>
        </FormControl> */}
        {/* <Button
                children="filter"
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                    onChange(filters)
                }}
            /> */}
        {Object.keys(filters).length ? (
          <Button
            disabled={!Object.keys(filters).length}
            children="clear filter"
            size="small"
            color="primary"
            onClick={() => {
              onChange({});
            }}
          />
        ) : (
          <div />
        )}
      </>
    );
  },
  (prev, next) => true
);
