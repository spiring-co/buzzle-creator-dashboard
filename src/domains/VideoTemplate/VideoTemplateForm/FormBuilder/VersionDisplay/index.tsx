import React, { useContext, useEffect, useState } from "react";

import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  Box,
  Paper,
  CircularProgress,
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import useActions from "contextStore/actions";
import Alert from "@material-ui/lab/Alert";
import { ExpandMore, ArrowForward, ArrowBack, Add } from "@material-ui/icons";

import { VideoTemplateContext } from "contextStore/store";

import { getLayersFromComposition } from "helpers";
import { VideoTemplate } from "services/buzzle-sdk/types";
import { SmallText, SubHeading, Text } from "common/Typography";
import EditIcon from '@material-ui/icons/Edit';
import Ribbon from "common/Ribbon";
import AddOrUpdateVersionDialog from "./AddOrUpdateVersionDialog";

type IProps = {
  isEdit: boolean,
  isSubmitting?: boolean,
  handleSubmitForm: Function,
  submitError: Error | null,
  compositions: any,
  activeDisplayIndex: number,
  setActiveDisplayIndex: (value: number) => void,
}
export default ({
  isEdit,
  isSubmitting,
  handleSubmitForm,
  submitError,
  compositions,
  activeDisplayIndex,
  setActiveDisplayIndex,
}: IProps) => {
  const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext);
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [mode, setMode] = React.useState<"edit" | "add" | "">("");

  const handleAdd = () => {
    setMode("add");
  };
  const { removeVersion, } = useActions();
  const [isVersionValid, setIsVersionValid] = useState(
    videoObj?.versions?.map(({ fields, composition }) => {
      const extracted = getLayersFromComposition(compositions[composition], undefined, videoObj?.type || 'ae');
      const compLayer = Object.keys(extracted)?.flatMap((k) =>
        extracted[k]?.map((layer: any) => layer?.name ?? layer)
      );
      return fields
        ?.map(({ rendererData }) => rendererData?.layerName as string)
        .every((layer) => compLayer.includes(layer));
    })
  );
  const [isVersionsFieldsDuplicate, setIsVersionsFieldsDuplicate] = useState(
    videoObj?.versions?.map(({ fields }) => {
      const layerWithProperty = fields?.map(
        ({ rendererData: { layerName, property } }) => layerName + property
      );
      if (new Set(layerWithProperty)?.size !== layerWithProperty.length) {
        return true;
      } else return false;
    })
  );
  useEffect(() => {
    setIsVersionValid(
      videoObj?.versions?.map(({ fields, composition }) => {
        const extracted = getLayersFromComposition(compositions[composition], undefined, videoObj?.type ?? 'ae');
        const compLayer = Object.keys(extracted)?.flatMap((k) =>
          extracted[k]?.map((layer: any) => layer?.name ?? layer)
        );
        return fields
          ?.map(({ rendererData: { layerName } }) => layerName)
          .every((layer) => compLayer.includes(layer));
      })
    );
    setIsVersionsFieldsDuplicate(
      videoObj?.versions?.map(({ fields }) => {
        const layerWithProperty = fields?.map(
          ({ rendererData: { layerName, property } }) => layerName + property
        );
        if (new Set(layerWithProperty)?.size !== layerWithProperty.length) {
          return true;
        } else return false;
      })
    );
  }, [videoObj]);

  useEffect(() => {
    setActiveVersionIndex(videoObj.versions.length);
  }, [videoObj]);

  const handleDeleteVersion = (index: number) => {
    setActiveVersionIndex(activeVersionIndex - 1);
    removeVersion(index);
  }
  const handleCancel = () => {
    if (mode === "edit") {
      handleClose();
    } else {
      removeVersion(activeVersionIndex);
      handleClose();
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setMode('edit')
  };

  const handleClose = () => {
    setMode("")
    setEditIndex(null);
  };


  return (
    <Box >
      <Box style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
        <SubHeading>Versions</SubHeading>
        {videoObj.versions.length ? <Button
          style={{ margin: 10 }}
          endIcon={<Add />}
          size="small"
          variant="contained"
          color="primary"
          onClick={handleAdd}
          children="Add Version"
        /> : <div />}
      </Box>
      <Box style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', padding: 15, paddingLeft: 0, }}>
        {!videoObj.versions.length ? (
          <Card variant="outlined" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Text color="textSecondary">
              No Version Added Yet.
            </Text>
            <Button
              style={{ marginLeft: 20 }}
              endIcon={<Add />}
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAdd}
              children="Add Version"
            />
          </Card>
        ) : (
          videoObj?.versions?.map((item, index) => {
            const noOfImageInputs = item?.fields?.filter(({ type }) => type === 'image').length
            const noOfTextInputs = item?.fields?.filter(({ type }) => (type === 'string' || type === 'data')).length
            if (index === activeVersionIndex) {
              return <div />;
            }
            if (index === editIndex) {
              return <div />;
            }
            return (
              <Card key={item?.title} style={{
                maxWidth: 345, position: 'relative',
                overflow: 'visible', marginRight: 20, marginBottom: 20
              }}>
                {!isVersionValid[index] && (
                  <Ribbon variant="error" text="Some fields not found in this composition!" type="lower" style={{ left: -10, top: -5 }} />
                )}
                {isVersionsFieldsDuplicate[index] && (
                  <Ribbon variant="warning" text="Contains Duplicate Fields!" type="lower" style={{
                    left: -10,
                    top: 35
                  }} />
                )}
                <video
                  height={150}
                  controls
                  width="100%"
                  style={{ backgroundColor: '#000' }}
                  poster={videoObj?.thumbnail}
                  src={item?.sample} />
                <CardContent>
                  <Text style={{ fontWeight: 600 }}>
                    {item.title}
                  </Text>
                  <SmallText color="textSecondary" >
                    Contains {noOfTextInputs} Text fields and {noOfImageInputs} Image fields
                  </SmallText>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton style={{ marginLeft: 'auto' }} onClick={() => handleEdit(index)} aria-label={`Edit this version ${item.title}`}>
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            );
          })
        )}
      </Box>
      {mode ? <AddOrUpdateVersionDialog
        editIndex={editIndex}
        compositions={compositions}
        onDone={handleClose}
        handleClose={handleCancel}
        isEdit={mode === 'edit'}
      /> : <div />}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>
        {(videoObj?.type ?? 'ae') === 'ae' ? <Button
          disabled={
            videoObj.versions.length === 0 ||
            !!mode ||
            !isVersionValid?.every((v) => v) ||
            !isVersionsFieldsDuplicate?.every((v) => !v)
          }
          endIcon={<ArrowForward />}
          color="primary"
          variant="contained"
          onClick={() => {
            setActiveDisplayIndex(activeDisplayIndex + 1)
          }}>
          Next
        </Button> : <Button
          endIcon={isSubmitting && <CircularProgress color="inherit" size={15} />}
          disabled={isSubmitting}
          style={{ margin: 10 }}
          color={submitError ? "secondary" : "primary"}
          variant={submitError ? "outlined" : "contained"}
          children={
            submitError ? "Retry" : isSubmitting ? "Submitting" : "Submit"
          }
          onClick={() => handleSubmitForm(videoObj)}
        />}
      </Box>
    </Box>
  );
};
