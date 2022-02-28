import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography, IconButton
} from "@material-ui/core";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { makeStyles, } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";
import FileUploader from "common/FileUploader";
import { SubHeading, Text } from "common/Typography";
import useActions from "contextStore/actions";
import React, { useContext, useEffect, useState } from "react";
import { getLayersFromComposition } from "helpers";
import { VideoTemplate } from "services/buzzle-sdk/types";
import { VideoTemplateContext } from "contextStore/store";
const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
  },
}));
type IProps = {
  compositions: any,
  isFontNavigated: boolean,
  setIsFontNavigated: Function,
  setActiveDisplayIndex: (value: number) => void,
  activeDisplayIndex: number,
  fonts: Array<{ name: string, src: string }>
}
export default function FontUpload({
  compositions, fonts,
  setActiveDisplayIndex,
  setIsFontNavigated, isFontNavigated,
  activeDisplayIndex,
}: IProps) {
  const { editVideoKeys } = useActions();
  const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext);
  const classes = useStyles()
  const [fontList, setFontList] = useState<Array<{ name: string, src: string }>>([]);
  const [isValid, setIsValid] = useState(false);
  // takes all font used in template
  useEffect(() => {
    setIsFontNavigated(true)
    setFontList(isFontNavigated ? videoObj?.fonts || [] : fonts.map(fontName => videoObj?.fonts?.find(({ name }) => name === fontName.name) || fontName))

  }, [])

  const handleReset = () => {
    setFontList(fonts.map(fontName => videoObj?.fonts?.find(({ name }) => name === fontName.name) || fontName))
  }

  useEffect(() => {
    editVideoKeys({ fonts: fontList });
    setIsValid(fontList.every((i) => !!i.src));
  }, [fontList]);

  return (
    <Box>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SubHeading>Upload Font Files</SubHeading>
        <IconButton onClick={handleReset}>
          <RotateLeftIcon />
        </IconButton>
      </Box>
      <Box mt={2}>
        <List className={classes.root}>
          {fontList.length ? (
            fontList.map((font, index) => (
              <Box key={font.name}>
                <ListItem>
                  <FileUploader
                    uploadFileNameColor="#4BB543"
                    value={font.src}
                    storageType="archive"
                    label={font.name}
                    helperText={font.src ? "" : "Upload Font or Ignore to continue"}
                    name={font.name}
                    forceUploadDirectory={true}
                    uploadDirectory={`templates/${videoObj?.title}/fonts`}
                    onChange={(value: string) => {
                      setFontList((list) => {
                        return list?.map((item) => item.name === font.name
                          ? ({ ...item, src: value })
                          : item)
                      });
                    }}
                    accept={".ttf,.otf"}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      disabled={!!font.src}
                      onClick={() => {
                        setFontList(fontList.filter(({ name }, i) => name !== font.name));
                      }}
                      color="secondary">
                      Ignore
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== fontList.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight={200}>
              <Text color="textSecondary">No Fonts Found in this template!</Text>
            </Box>
          )}
        </List>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>

        <Button
          disabled={!isValid}
          endIcon={<ArrowForward />}
          color="primary"
          variant="contained"
          onClick={() => {
            setActiveDisplayIndex(activeDisplayIndex + 1)
          }}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
