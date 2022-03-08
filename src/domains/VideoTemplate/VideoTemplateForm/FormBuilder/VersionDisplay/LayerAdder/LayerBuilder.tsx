/* eslint-disable default-case */
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import Alert from '@material-ui/lab/Alert';
import React, { useContext, useEffect, useState } from "react";
import { getLayersFromComposition } from "helpers";
import AddAndUpdateFieldsDialog from "./AddAndUpdateFieldsDialog";
import {
  Button, Paper, Typography, Tooltip, Box, TextField, Divider, MenuItem, Card,
  ListItem, ListItemText, ListItemSecondaryAction, IconButton, List, Chip
} from "@material-ui/core";
import { Wallpaper, TextFields, Add, Edit, Delete } from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FieldInterface, VideoTemplate } from "services/buzzle-sdk/types";
import { imageComp, textComp } from "common/types";
import Ribbon from "common/Ribbon";
import { Text } from "common/Typography";
import FormTextInput from "common/FormTextInput";
import FormImageInput from "common/FormImageInput";


const getItemStyle = (isDragging: boolean, draggableStyle: any, style: React.CSSProperties) => ({
  // styles we need to apply on draggables
  ...(isDragging ? {
    background: "#e4f5fa",
    border: "2px solid #4894fa",
  } : {}),
  ...style,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  ...(isDraggingOver ? {
    background: "#fbe3e7",
  } : {}),
  padding: 8,
  maxWidth: 600
});
type IProps = {
  compositions: any, editVersion: boolean, activeVersionIndex: number
}
export default React.memo(({ compositions, editVersion, activeVersionIndex }: IProps) => {
  const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext);
  const {
    updateField,
    addField,
    removeField,
    restoreFieldsFromPreviousVersion,
    restoreChanges,
    swapFields
  } = useActions();
  const [currentCompositionFields, setCurrentCompositionFields] = useState<Array<string>>([]);
  const [editIndex, setEditIndex] = useState<null | number>(null);
  const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
  const [restoreStatus, setRestoreStatus] = useState<boolean>(false);
  const layerWithProperty = videoObj.versions[activeVersionIndex]?.fields?.map(({ rendererData: { layerName, property } }) => layerName + property)
  const [importVersionIndex, setImportVersionIndex] = useState<number | null>(null)

  let layers: any[]
  useEffect(() => {
    const fieldsFromComp = getLayersFromComposition(
      compositions[videoObj.versions[activeVersionIndex].composition], undefined, videoObj?.type ?? 'ae'
    );
    layers = Object.keys(fieldsFromComp)
      .map((layerType) => fieldsFromComp[layerType].map((layer: textComp | imageComp) => layer?.name ?? layer))
      .flat()
    setCurrentCompositionFields(layers);
  }, [])
  // useEffect(() => {
  //   let layers = getLayersFromComposition(
  //     compositions[videoObj.versions[activeVersionIndex].composition], undefined, videoObj?.type ?? 'ae'
  //   );
  //   layers = Object.keys(layers)
  //     .map((layerType) => layers[layerType].map((layer: textComp | imageComp) => layer?.name ?? layer))
  //     .flat();
  //   setCurrentCompositionFields(layers);
  //     // get common layers stringified
  //     const mainVersionFields = videoObj.versions[0]?.fields.map(({ type, rendererData, constraints, placeholder, label }) =>
  //       rendererData?.layerName + rendererData?.property)
  //     const mainVersionFieldsStringified = videoObj.versions[0]?.fields.map(({ type, rendererData, constraints, placeholder, label }) =>
  //       JSON.stringify({ type, rendererData, constraints, placeholder, label }))
  //     const commonFieldsInCurrentVersion = videoObj?.versions[activeVersionIndex]?.fields?.filter(({ type, rendererData, constraints, placeholder, label }) =>
  //       mainVersionFields.includes(rendererData?.layerName + rendererData?.property))
  //     const isCommonLayersDifferent = !(commonFieldsInCurrentVersion.map(({ type, rendererData, constraints, placeholder, label }) =>
  //       mainVersionFieldsStringified.includes(JSON.stringify({ type, rendererData, constraints, placeholder, label })))).every(value => value)
  //     if (isCommonLayersDifferent) {
  //TODO NEW
  //       if (window.confirm("Some layers in this version are changed in the main version, Do you like to reflect the changes in this version?"))
  //         restoreChanges(activeVersionIndex, mainVersionFields)
  //     }
  //   
  // }, []);

  const handleAddField = (field: any) => {
    addField(activeVersionIndex, field);
  };

  const editField = (index: number) => {
    setEditIndex(index);
    setIsDialogVisible(true);
  };

  const deleteField = (item: any, index: number) => {
    removeField(activeVersionIndex, index);
  };

  const editFieldValue = (field: any) => {
    updateField(activeVersionIndex, editIndex, field);
    setEditIndex(null);
  };
  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    swapFields(activeVersionIndex, result.source.index, result.destination.index)
  };
  const renderFieldPreview = (item: FieldInterface, index: number) => {
    return (
      <Draggable key={item.key} draggableId={item.key} index={index}>
        {(provided, snapshot) => (
          <FieldPreviewContainer
            provided={provided}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style, styles.fieldPreview
            )}
            editField={() => editField(index)}
            deleteField={() => deleteField(item, index)}
            index={index}
            children={
              <Box
                style={{ display: "flex", position: 'relative' }}>
                {item?.rendererData?.type === "data" ? (
                  <FormTextInput
                    tags={<>{!currentCompositionFields.includes(item?.rendererData?.layerName ?? "") ? <Chip color="primary" style={{
                      fontSize: 12, height: 20,
                      alignSelf: 'flex-start',
                      background: "#d32f2f", color: "#fff",
                      marginRight: 10, marginBottom: 15
                    }} label={"Field not found in this compostion!"} size="small" /> : <div />}
                      {layerWithProperty.filter(v => v === item?.rendererData?.layerName + item?.rendererData?.property).length !== 1
                        ? <Chip color="primary" style={{
                          fontSize: 12, height: 20,
                          alignSelf: 'flex-start',
                          backgroundColor: "#ffc372", color: "#663c00",
                          marginRight: 10, marginBottom: 15
                        }} label={"Duplicate Field!"} size="small" /> : <div />
                      }
                    </>}
                    otherProps={{ variant: 'outlined' }} name={item.key} {...item} mode="preview" />) : (
                  <FormImageInput
                  tags={<>{!currentCompositionFields.includes(item?.rendererData?.layerName ?? "") ? <Chip color="primary" style={{
                    fontSize: 12, height: 20,
                    alignSelf: 'flex-start',
                    background: "#d32f2f", color: "#fff",
                    marginRight: 10, marginBottom: 15
                  }} label={"Field not found in this compostion!"} size="small" /> : <div />}
                    {layerWithProperty.filter(v => v === item?.rendererData?.layerName + item?.rendererData?.property).length !== 1
                      ? <Chip color="primary" style={{
                        fontSize: 12, height: 20,
                        alignSelf: 'flex-start',
                        backgroundColor: "#ffc372", color: "#663c00",
                        marginRight: 10, marginBottom: 15
                      }} label={"Duplicate Field!"} size="small" /> : <div />
                    }
                  </>}
                    mode="preview" name={item.key} {...item} />
                )}
              </Box>
            }
          />)}</Draggable>
    );
  };

  return (
    <Box style={styles.container}>
      <Box style={{ display: 'flex', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <Tooltip title="Adds Field to version">
          <Button
            style={{ marginBottom: 10 }}
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
        {((videoObj?.versions?.length ?? 1) - 1) !== 0 ?
          <>
            <Text style={{ margin: 10, marginTop: 0 }} color="textSecondary">Or</Text>
            <TextField
              select
              style={{ maxWidth: 320, marginTop: 0, marginBottom: 10 }}
              label="Import Common fields from other version"
              placeholder="Select Version"
              margin="dense"
              onChange={(e) => setImportVersionIndex(parseInt(e.target.value))}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    disabled={importVersionIndex == null}
                    color="primary"
                    size="small"
                    children="import" onClick={() =>
                      restoreFieldsFromPreviousVersion(importVersionIndex, activeVersionIndex, currentCompositionFields.length ? currentCompositionFields : layers)} />
                  <Divider style={{
                    height: 28,
                    margin: 4,
                  }} orientation="vertical" />
                </Box>
              }}
              variant="outlined"
              value={importVersionIndex}>
              {videoObj.versions.slice(0, videoObj.versions.length - 1).map((option, index) => (
                <MenuItem key={option.title} value={index}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField></> : <div />}
      </Box>
      <Text style={{ fontWeight: 700 }}>Field Previews</Text>
      {videoObj.versions[activeVersionIndex]?.fields.length ? <List>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" >
            {(provided, snapshot) => (
              <div style={getListStyle(snapshot.isDraggingOver)} ref={provided.innerRef}
              >{videoObj.versions[activeVersionIndex]?.fields?.map(renderFieldPreview)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext></List> : <Text style={{ marginTop: 10 }} color="textSecondary">No Fields added yet!</Text>
      }
      {isDialogVisible ? (
        <AddAndUpdateFieldsDialog
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
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]?.key :
                "",
            property:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.property : "",
            propertyType:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]?.type :
                "",
            placeholder:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.placeholder : "",
            type:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.type : "",
            layerName:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.layerName : "",
            label:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]?.label :
                "",
            required:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.required : false,
            width:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.width : 400,
            extension:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.rendererData?.extension : "png",
            height:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.height : 400,
            maxLength:
              editIndex !== null ? videoObj.versions[activeVersionIndex]?.fields[editIndex]
                ?.constraints?.maxLength : 50,
          }}
          editField={editIndex !== null}
          onClose={setIsDialogVisible}
          onDataSubmit={editIndex !== null ? editFieldValue : handleAddField}
        />
      ) : <div />}
    </Box>
  );
}, (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
)

const FieldPreviewContainer = ({
  editField,
  deleteField,
  ref,
  index, provided,
  children, style,
  ...props
}: any) => {
  return (
    <Card
      variant="outlined"
      {...props}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={style}
    >
      <ListItem>
        <ListItemText>
          {children}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={editField} aria-label="edit">
            <Edit />
          </IconButton>
          <IconButton onClick={deleteField} edge="end" aria-label="delete">
            <Delete />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Card>

  );
};

const styles = {
  container: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
  },
  fieldPreview: { margin: 10 },
};
