import {
    FormControl
    , InputLabel, MenuItem, Select, Button,
} from "@material-ui/core";
import { Job, VideoTemplate, Creator, Search } from "services/api";
import ErrorHandler from "components/ErrorHandler";
import React, { useEffect, useRef, useState } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default ({ value = {}, onChange, }) => {
    const [loading, setLoading] = useState(true)
    const [videoTemplates, setVideoTemplates] = useState([])
    const [filters, setFilters] = useState(value)
    useEffect(() => {
        videoTemplates.length === 0 && VideoTemplate.getAll(1, 500).then(({ data }) => setVideoTemplates(data)).catch(console.log).finally(() => setLoading(false))
    }, [])
    useEffect(() => {
        onChange(filters)
    }, [filters])
    return (
        <><MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                style={{ width: 150, marginBottom: 0 }}
                disableToolbar
                margin="dense"
                format="MM/dd/yyyy"
                id="date-picker-inline"
                label="Start date"
                value={value?.startDate ?? null}
                onChange={v => setFilters({ ...filters, startDate: new Date(v).toISOString(), })}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
            <KeyboardDatePicker
                margin="dense"
                style={{ marginLeft: 10, width: 150, marginRight: 10, marginBottom: 0 }}
                disableToolbar
                format="MM/dd/yyyy"
                id="date-picker-inline"
                label="End date"
                value={value?.endDate ?? null}
                onChange={v => setFilters({ ...filters, endDate: new Date(v).toISOString() })}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
            <FormControl style={{ marginRight: 10, minWidth: 150, }}>
                <InputLabel id="demo-simple-select-label">Video Template</InputLabel>
                <Select
                    disabled={loading}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value?.idVideoTemplate}
                    onChange={({ target: { value } }) => setFilters({ ...filters, idVideoTemplate: value })}
                >
                    {videoTemplates.map(({ title, id }) => <MenuItem value={id}>{title}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl style={{ marginRight: 10, width: 100, }}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value?.state}
                    onChange={({ target: { value } }) => setFilters({ ...filters, state: value })}
                >
                    <MenuItem value={""}>All</MenuItem>
                    <MenuItem value={'error'}>Error</MenuItem>
                    <MenuItem value={'created'}>Created</MenuItem>
                    <MenuItem value={'finished'}>Finished</MenuItem>
                </Select>
            </FormControl>
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
                        onChange({})
                    }}
                />
            ) : <div />}
        </>)
}