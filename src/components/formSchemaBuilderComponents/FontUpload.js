import {
  Button,
  Container,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Box,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getLayersFromComposition } from "services/helper";
import {
  ArrowForward,
  ArrowBack,
  HelpOutline,
  Backup,
} from "@material-ui/icons";
import FontUploader from "./FontUploader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

export default function FontUpload({
  compositions,
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  const [fontList, setFontList] = useState([]);
  const [loading, setLoading] = useState(true);
  // takes all font used in template
  useEffect(() => {
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();

    const fontNames = Array.from(new Set(allTextLayers.map((l) => l.font)));
    console.log(fontNames);
    // this is without checking font Status
    setFontList(fontNames.map((f) => ({ name: f, src: "hiih" })));
    setLoading(false);
    //TODO call it to check status
    // fetchFontStatus(fontNames)
    //   .then(setFontList)
    //   .catch(console.log)
    //.finally(() => setLoading(false));
  }, [compositions]);

  useEffect(() => {
    editVideoKeys({ idFontsUsed: fontList });
  }, [fontList]);

  const fetchFontStatus = async (fontArray) => {
    // TODO to be implmented
    // return something like
    // src will be empty when not installed, and else return the url
    //[{name:"OpenSans Bold" src:"http://examle.com"},{name:"Helvit",src:""}]
  };
  if (loading) {
    return <Typography variant="h5">Resolving Font...</Typography>;
  }
  return (
    <div>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography style={{ color: "grey" }}>
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      <Divider />
      <Box mt={2}>
        <List dense>
          {fontList.map((f, i) => (
            <ListItem key={i}>
              <ListItemAvatar>
                <Avatar>
                  <HelpOutline />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={f} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <Backup />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
      <Container
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {fontList.length !== 0 ? (
          fontList.map((font, index) => (
            <FontUploader
              key={index}
              font={font}
              handleDelete={() => {
                setFontList(fontList.filter((a, i) => i !== index));
              }}
              setFont={(src) => {
                fontList[index] = { ...fontList[index], src };
                setFontList(fontList);
              }}
            />
          ))
        ) : (
          <p>No Font Found!</p>
        )}
      </Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          startIcon={<ArrowBack />}
          style={{ margin: 10 }}
          color="primary"
          variant="outlined"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}>
          Back
        </Button>

        <Button
          endIcon={<ArrowForward />}
          style={{ margin: 10 }}
          color="primary"
          variant="contained"
          onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
