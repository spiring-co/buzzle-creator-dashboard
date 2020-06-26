/* eslint-disable default-case */
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import React, { useContext, useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import AddFields from "./AddFieldDialog";
import { Button, Paper, Typography, Tooltip } from "@material-ui/core";
import { Wallpaper, TextFields, Add } from "@material-ui/icons";
export default ({
  compositions,
  //usedFields,
  editVersion,
  activeVersionIndex,
  // setUsedFields,
}) => {
  const [videoObj] = useContext(VideoTemplateContext);

  const {
    updateField,
    addField,
    removeField,
    restoreFieldsFromPreviousVersion,
  } = useActions();
  const [currentCompositionFields, setCurrentCompositionFields] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState(false);

  useEffect(() => {
    let layers = getLayersFromComposition(
      compositions[videoObj.versions[activeVersionIndex].composition]
    );
    layers = Object.keys(layers)
      .map((layerType) => layers[layerType].map(({ name }) => name))
      .flat();
    setCurrentCompositionFields(layers);
    if (
      !restoreStatus &&
      !editVersion &&
      videoObj.versions[0].title !== "" &&
      activeVersionIndex !== 0 &&
      videoObj.versions[activeVersionIndex]?.editableLayers.length === 0
    ) {
      if (
        window.confirm("Do you want to restore fields from previous version")
      ) {
        restoreFieldsFromPreviousVersion(activeVersionIndex, layers);
        setRestoreStatus(true);
      }
    }
  }, []);

  const handleAddField = (field) => {
    // setUsedFields([...usedFields, field,aeLayers.layerName]);
    addField(activeVersionIndex, field);
  };

  const _editField = (index) => {
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const _deleteField = (item, index) => {
    //setUsedFields(usedFields.filter((i) => i !== item.layerName));
    removeField(activeVersionIndex, index);
  };

  const editFieldValue = (field) => {
    //if user changed field name
    // if (
    //   videoObj.versions[activeVersionIndex]?.editableLayers[editIndex]
    //     .layerName !== value.layerName
    // ) {
    //   setUsedFields(
    //     usedFields.map((item) => {
    //       if (
    //         item ===
    //         videoObj.versions[activeVersionIndex]?.editableLayers[editIndex]
    //           .layerName
    //       ) {
    //         return value.layerName;
    //       } else return item;
    //     })
    //   );
    // }
    updateField(activeVersionIndex, editIndex, field);
    setEditIndex(null);
  };

  const renderFieldPreview = (item, index) => {
    return (
      <FieldPreviewContainer
        _editField={() => _editField(index)}
        _deleteField={() => _deleteField(item, index)}
        index={index}
        children={
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            {item?.rendererData?.type === "data" ? (
              <>
                <TextFields
                  style={{
                    fontSize: 40,
                    margin: 10,
                    padding: 5,
                    border: "1px solid grey",
                  }}
                />
                {item?.constraints?.maxLength && <Typography>
                  <strong>Max Length:</strong> {item?.constraints?.maxLength}, &nbsp;{" "}
                </Typography>}
                <Typography>
                  {" "}
                  <strong>Label:</strong> {item?.label}, &nbsp;{" "}
                </Typography>
                <Typography>
                  {" "}
                  <strong>Layer name:</strong> {item?.rendererData?.layerName},&nbsp;
                </Typography>
                <Typography>
                  {" "}
                  <strong>Property:</strong> {item?.rendererData?.property},&nbsp;
                </Typography>
                <Typography>
                  {" "}
                  <strong>Required:</strong> {item?.constraints?.required ? "true" : "false"}
                </Typography>
              </>
            ) : (
                <>
                  <Wallpaper
                    style={{
                      fontSize: 40,
                      margin: 10,
                      padding: 5,
                      border: "1px solid grey",
                    }}
                  />
                  {item?.constraints?.width && <Typography>
                    <strong>Width:</strong> {item?.constraints?.width}, &nbsp;{" "}
                  </Typography>}
                  {item?.constraints?.height && <Typography>
                    {" "}
                    <strong>Height:</strong> {item?.constraints?.height}, &nbsp;{" "}
                  </Typography>}
                  <Typography>
                    {" "}
                    <strong>Layer name:</strong> {item?.rendererData?.layerName}, &nbsp;{" "}
                  </Typography>
                  {item?.rendererData?.property && <Typography>
                    {" "}
                    <strong>Property:</strong> {item?.rendererData?.property},&nbsp;
                </Typography>}
                  <Typography>
                    {" "}
                    <strong>Required:</strong> {item?.constraints?.required ? "true" : "false"}
                  </Typography>
                </>
              )}
          </div>
        }
      />
    );
  };

  return (
    <Paper style={styles.container}>
      <Tooltip title="Adds Field to version">
        <Button
          style={{ margin: 10 }}
          endIcon={<Add />}
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            setEditIndex(null);
            // usedFields.length !== currentCompositionFields.length
            //   ? setIsDialogVisible(true)
            //   : alert("No layers in the composition");
          }}
          children="Add Field"
        />
      </Tooltip>
      {videoObj.versions[activeVersionIndex]?.fields?.map(
        renderFieldPreview
      )}

      {isDialogVisible &&
        //usedFields.length !== currentCompositionFields.length &&
        (
          <AddFields
            textLayers={getLayersFromComposition(
              compositions[videoObj?.versions[activeVersionIndex]?.composition],
              "textLayers"
            )}
            imageLayers={getLayersFromComposition(
              compositions[videoObj?.versions[activeVersionIndex]?.composition],
              "imageLayers"
            )}
            // usedFields={usedFields}
            initialValue={{
              key: videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.key ?? "",
              property: videoObj.versions[activeVersionIndex]?.fields[editIndex]?.rendererData
                ?.property ?? "",
              propertyType:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]
                  ?.type ?? "",
              type:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.rendererData
                  ?.type ?? "",
              layerName:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.rendererData
                  ?.layerName ?? "",
              label:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]
                  ?.label ?? "",
              required:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.constraints
                  ?.required ?? false,
              width:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.constraints
                  ?.width ?? 400,
              height:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.constraints
                  ?.height ?? 400,
              maxLength:
                videoObj.versions[activeVersionIndex]?.fields[editIndex]?.constraints
                  ?.maxLength ?? 50,
            }}
            editField={editIndex !== null}
            toggleDialog={setIsDialogVisible}
            editFieldValue={editFieldValue}
            addField={handleAddField}
          />
        )}
    </Paper>
  );
};

const FieldPreviewContainer = ({
  _editField,
  _deleteField,

  index,
  children,
  ...props
}) => {
  return (
    <Paper style={styles.fieldPreview} {...props}>
      {children}
      <Button
        size="small"
        style={{ margin: 5, marginBottom: 0 }}
        variant="contained"
        color="primary"
        onClick={_editField}>
        Edit
      </Button>
      <Button
        size="small"
        style={{ margin: 5, marginBottom: 0 }}
        variant="outlined"
        color="secondary"
        onClick={_deleteField}>
        Delete
      </Button>
    </Paper>
  );
};

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
  },
  fieldPreview: { padding: 20, margin: 10 },
};
