/* eslint-disable default-case */
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import AddFields from "./AddFieldDialog";
import { Button, Paper, Typography, Tooltip } from "@material-ui/core";
import { Wallpaper, TextFields, Add } from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const getItemStyle = (isDragging, draggableStyle, style) => ({
  // styles we need to apply on draggables
  ...draggableStyle,
  ...(isDragging && {
    background: "rgb(235,235,235)",
  }),
  ...style
});

const getListStyle = (isDraggingOver) => ({
  background: !isDraggingOver ? 'white' : '#e8ffcf',
});

export default React.memo(({ compositions, editVersion, activeVersionIndex }) => {
  const [videoObj] = useContext(VideoTemplateContext);
  const {
    updateField,
    addField,
    removeField,
    restoreFieldsFromPreviousVersion,
    restoreChanges,
    swapFields
  } = useActions();
  const [currentCompositionFields, setCurrentCompositionFields] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState(false);

  const layerWithProperty = videoObj.versions[activeVersionIndex]?.fields?.map(({ rendererData: { layerName, property } }) => layerName + property)

  useEffect(() => {
    let layers = getLayersFromComposition(
      compositions[videoObj.versions[activeVersionIndex].composition], '', videoObj?.type ?? 'ae'
    );
    layers = Object.keys(layers)
      .map((layerType) => layers[layerType].map((layer) => layer?.name ?? layer))
      .flat();
    setCurrentCompositionFields(layers);
    if (
      !restoreStatus &&
      !editVersion &&
      videoObj.versions[0].title !== "" &&
      activeVersionIndex !== 0 &&
      videoObj.versions[activeVersionIndex]?.fields.length === 0
    ) {
      if (
        window.confirm("Do you want to restore fields from previous version")
      ) {
        restoreFieldsFromPreviousVersion(activeVersionIndex, layers);
        setRestoreStatus(true);
      }
    } else if (editVersion) {
      // get common layers stringified
      const mainVersionFields = videoObj.versions[0]?.fields.map(({ type, rendererData, constraints, placeholder, label }) =>
        rendererData?.layerName + rendererData?.property)
      const mainVersionFieldsStringified = videoObj.versions[0]?.fields.map(({ type, rendererData, constraints, placeholder, label }) =>
        JSON.stringify({ type, rendererData, constraints, placeholder, label }))
      const commonFieldsInCurrentVersion = videoObj?.versions[activeVersionIndex]?.fields?.filter(({ type, rendererData, constraints, placeholder, label }) =>
        mainVersionFields.includes(rendererData?.layerName + rendererData?.property))
      const isCommonLayersDifferent = !(commonFieldsInCurrentVersion.map(({ type, rendererData, constraints, placeholder, label }) =>
        mainVersionFieldsStringified.includes(JSON.stringify({ type, rendererData, constraints, placeholder, label })))).every(value => value)
      if (isCommonLayersDifferent) {
        if (window.confirm("Some layers in this version are changed in the main version, Do you like to reflect the changes in this version?"))
          restoreChanges(activeVersionIndex, mainVersionFields)
      }
    }
  }, []);

  const handleAddField = (field) => {
    addField(activeVersionIndex, field);
  };

  const _editField = (index) => {
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const _deleteField = (item, index) => {
    removeField(activeVersionIndex, index);
  };

  const editFieldValue = (field) => {
    updateField(activeVersionIndex, editIndex, field);
    setEditIndex(null);
  };
  const onDragEnd = (result) => {
    console.log(result)
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    swapFields(activeVersionIndex, result.source.index, result.destination.index)
  };
  const renderFieldPreview = (item, index) => {
    return (
      <Draggable key={item.key} draggableId={item.key} index={index}>
        {(provided, snapshot) => (
          <FieldPreviewContainer
            provided={provided}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style, styles.fieldPreview
            )}
            _editField={() => _editField(index)}
            _deleteField={() => _deleteField(item, index)}
            index={index}
            children={
              <div
                style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                {!currentCompositionFields.includes(item?.rendererData?.layerName)
                  && <Alert severity="error">Layer Not Found!</Alert>
                }
                {layerWithProperty.filter(v => v === item?.rendererData?.layerName + item?.rendererData?.property).length !== 1
                  && <Alert severity="error">Duplicate Layer</Alert>
                }
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
                    {item?.constraints?.maxLength && (
                      <Typography>
                        <strong>Max Length:</strong> {item?.constraints?.maxLength},
                        &nbsp;{" "}
                      </Typography>
                    )}
                    <Typography>
                      {" "}
                      <strong>Label:</strong> {item?.label}, &nbsp;{" "}
                    </Typography>
                    <Typography>
                      {" "}
                      <strong>Layer name:</strong> {item?.rendererData?.layerName}
                      ,&nbsp;
                    </Typography>
                    <Typography>
                      {" "}
                      <strong>Property:</strong> {item?.rendererData?.property}
                      ,&nbsp;
                    </Typography>
                    <Typography>
                      {" "}
                      <strong>Required:</strong>{" "}
                      {item?.constraints?.required ? "true" : "false"}
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
                    {item?.constraints?.width && (
                      <Typography>
                        <strong>Width:</strong> {item?.constraints?.width}, &nbsp;{" "}
                      </Typography>
                    )}
                    {item?.constraints?.height && (
                      <Typography>
                        {" "}
                        <strong>Height:</strong> {item?.constraints?.height}, &nbsp;{" "}
                      </Typography>
                    )}
                    <Typography>
                      {" "}
                      <strong>Layer name:</strong> {item?.rendererData?.layerName},
                      &nbsp;{" "}
                    </Typography>
                    {item?.rendererData?.property && (
                      <Typography>
                        {" "}
                        <strong>Property:</strong> {item?.rendererData?.property}
                        ,&nbsp;
                      </Typography>
                    )}
                    <Typography>
                      {" "}
                      <strong>Required:</strong>{" "}
                      {item?.constraints?.required ? "true" : "false"}
                    </Typography>
                  </>
                )}
              </div>
            }
          />)}</Draggable>
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
            setIsDialogVisible(true);
          }}
          children="Add Field"
        />
      </Tooltip>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" >
          {(provided, snapshot) => (
            <div style={getListStyle(snapshot.isDraggingOver)} ref={provided.innerRef}
            >{videoObj.versions[activeVersionIndex]?.fields?.map(renderFieldPreview)}</div>
          )}
        </Droppable>
      </DragDropContext>

      {isDialogVisible && (
        <AddFields
          templateType={videoObj?.type ?? 'ae'}
          textLayers={getLayersFromComposition(
            compositions[videoObj?.versions[activeVersionIndex]?.composition],
            "textLayers", videoObj?.type ?? 'ae'
          )}
          imageLayers={getLayersFromComposition(
            compositions[videoObj?.versions[activeVersionIndex]?.composition],
            "imageLayers", videoObj?.type ?? 'ae'
          )}
          initialValue={{
            key:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]?.key ??
              "",
            property:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.property ?? "",
            propertyType:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]?.type ??
              "",
            placeholder:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.placeholder ?? "",
            type:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.type ?? "",
            layerName:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.layerName ?? "",
            label:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]?.label ??
              "",
            required:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.required ?? false,
            width:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.width ?? 400,
            extension:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.extension ?? "png",
            height:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.height ?? 400,
            maxLength:
              videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.maxLength ?? 50,
          }}
          editField={editIndex !== null}
          toggleDialog={setIsDialogVisible}
          handleChange={editIndex !== null ? editFieldValue : handleAddField}
        />
      )}
    </Paper>
  );
}, (prev, next) => prev?.composition?.length === next?.composition?.length
  && prev?.editVersion === next?.editVersion
  && prev?.activeVersionIndex === next?.activeVersionIndex
)

const FieldPreviewContainer = ({
  _editField,
  _deleteField,
  ref,
  index, provided,
  children, style,
  ...props
}) => {
  return (
    <Paper
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={style}
      {...props}>
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
