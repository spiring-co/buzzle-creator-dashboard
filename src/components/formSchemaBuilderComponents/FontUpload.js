import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { getLayersFromComposition } from "services/helper";

// TODO split into individuals
import { ArrowForward, ArrowBack } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";

import useActions from "contextStore/actions";
import { Fonts } from "services/api";
import FileUploader from "components/FileUploader";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // borderRadius: 4,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const { editVideoKeys } = useActions();
  const [fontList, setFontList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const classes = useStyles();
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));
    // this is without checking font Status
    Promise.all(fontNames.map((f) => Fonts.getStatus(f))).then((data) => {
      setFontList(data);
      setLoading(false);
    });
  }, [compositions]);

  useEffect(() => {
    editVideoKeys({ fonts: fontList });
    setIsValid(fontList.every((i) => !!i.src));
  }, [fontList]);

  return (
    <Box>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography color="textSecondary">
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      {loading ? (
        <Box mt={4}>
          <CircularProgress size={20} />
          <Typography>Resolving Fonts...</Typography>
        </Box>
      ) : (
        <Box mt={2}>
          <List className={classes.root}>
            {fontList && fontList.length ? (
              fontList.map((font, index) => (
                <Box key={font.name}>
                  <ListItem>
                    <ListItemText
                      primary={font.name}
                      secondary={
                        font.src ? (
                          <>
                            <DoneIcon style={{ paddingTop: 10 }} size="small" />
                            <Typography variant="span"> Resolved</Typography>
                          </>
                        ) : (
                          "Upload or Ignore to continue"
                        )
                      }
                    />
                    <ListItemSecondaryAction>
                      <Button
                        onClick={() => {
                          setFontList(fontList.filter((a, i) => i !== index));
                        }}
                        color="secondary">
                        Ignore
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <FileUploader
                    value={font.src}
                    name={font.name}
                    uploadDirectory={"fonts"}
                    onChange={(value) => {
                      setFontList((fl) => {
                        fl[index]["src"] = value;
                        return Array.from(fl);
                      });
                    }}
                    accept={".ttf,.otf"}
                    onError={console.log}
                  />
                  {index !== fontList.length - 1 && <Divider />}
                </Box>
              ))
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight={200}>
                <Typography>No Fonts Found!</Typography>
              </Box>
            )}
          </List>
        </Box>
      )}
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
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
