import React, { useEffect, useRef, useState } from "react";
import {
    Dialog, DialogTitle, Button, DialogActions, DialogContent
} from "@material-ui/core";
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

export default ({ json, onSubmit, onClose }) => {
    const [value, setValue] = useState(json)
    return (<>
        <Dialog
            fullWidth
            onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle id="simple-dialog-title">Edit/View JSON</DialogTitle>
            <DialogContent>
                <Editor
                    value={value}
                    onChange={setValue}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
          </Button>
                <Button onClick={() => {
                    delete value['tableData']
                    onSubmit(value)
                }}
                    variant="contained"
                    color="primary">
                    Update
          </Button>
            </DialogActions>
        </Dialog>
    </>)
}