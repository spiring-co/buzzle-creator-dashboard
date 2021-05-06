import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// TODO split into individuals
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";
import { Font } from "services/api";
import FileUploader from "common/FileUploader";
import useActions from "contextStore/actions";
import React, { useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";

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
    setFontList(fontNames.map((f) => ({
      name: f,
      src: "",
    })))

  }, [compositions]);

  useEffect(() => {
    editVideoKeys({ fonts: fontList });
    setIsValid(fontList.every((i) => !!i.src));
  }, [fontList]);

  return (
    <Box>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography color="textSecondary">
        Upload your Font File
      </Typography>
      {/* {loading ? (
        <Box mt={4}>
          <CircularProgress size={20} />
          <Typography>Resolving Fonts...</Typography>
        </Box>
      ) : ( */}
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
                            <DoneIcon
                              style={{ paddingTop: 10 }}
                              color={"green"}
                              size="small"
                            />
                            <Typography
                              variant="span"
                              style={{ color: "green" }}>
                              Resolved
                            </Typography>
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
                  <div style={{margin:15,marginTop:0,marginBottom:0}}>
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
                    onError={null}
                  />
                  </div>
                  {index !== fontList.length - 1 && <Divider />}
                </Box>
              ))
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight={200}>
                <Typography>No Font Found!</Typography>
              </Box>
            )}
          </List>
        </Box>
      {/* )} */}
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
