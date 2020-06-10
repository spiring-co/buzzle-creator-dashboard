import React, { useState, useContext, useEffect } from "react";
import LayerBuilder from "components/formSchemaBuilderComponents/LayerBuilder";
import { Button, TextField } from "@material-ui/core";
import { VideoTemplateContext } from "contextStore/store";
import useActions from "contextStore/actions";

export default ({
    isEdit,
    activeVersionIndex,
    editVersion,
    setActiveVersionIndex,
    openVersionDisplay,
    onBack,
    onCancel
}) => {
    const [videoObj] = useContext(VideoTemplateContext);
    const { editversionKeys } = useActions()
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}>
            <TextField
                margin={"dense"}
                variant={"outlined"}
                type="file"
                onChange={e => editversionKeys(activeVersionIndex, {
                    sample: e.target.files[0]
                })}
                InputLabelProps={{
                    shrink: true,
                }}
                label="Version Sample Video"
            />
            <div>
                <Button
                    onClick={() => onBack()}
                    size="small"
                    style={{ width: 'fit-content', marginTop: 10 }}
                    children="back"
                />
                <Button
                    disabled={!videoObj?.versions[activeVersionIndex]?.sample}
                    style={{ marginTop: 10 }}
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={() => {
                        if (!editVersion) {
                            setActiveVersionIndex(activeVersionIndex + 1);
                        }
                        openVersionDisplay();
                    }}
                    children={
                        isEdit ? "Save Edits" : editVersion ? "Save Edits" : "Create Version"
                    }
                />
            </div>
        </form>
    );
};
