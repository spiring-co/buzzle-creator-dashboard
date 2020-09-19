import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import DoneIcon from "@material-ui/icons/Done";
import FileUploader from "components/FileUploader";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export default function FontUpload({ fonts, value, onSubmit }) {
  const [fontFiles, setFontFiles] = useState(value);
  const classes = useStyles();

  useEffect(() => {
    setFontFiles(
      new Array(
        ...fonts.map((name) => ({
          name,
          src: "",
        }))
      )
    );
  }, [fonts]);

  const handleFontUpload = (name, src) => {
    const indexToReplace = fontFiles.findIndex((f) => f.name === name);
    if (indexToReplace == -1) return;
    setFontFiles((prevValue) => {
      prevValue[indexToReplace] = { name, src };
      return new Array(...prevValue);
    });
  };

  const handleFontRemove = (name) => {
    setFontFiles((prevValue) => {
      return new Array(...prevValue.filter((f) => !(f.name === name)));
    });
  };

  return (
    <Box>
      <Typography variant="h5">Upload Font Files</Typography>
      <Typography color="textSecondary">
        We will try to resolve your fonts automatically, if not resolved, Upload
        your Font File
      </Typography>
      <Box mt={2}>
        {JSON.stringify(fontFiles, null, 2)}
        <List className={classes.root}>
          {fontFiles.map((font, index) => (
            <Box key={font.name}>
              <FontUploadItem
                value={font}
                onChange={handleFontUpload}
                onRemove={handleFontRemove}
              />
              {index !== fontFiles.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          color="primary"
          variant="outlined"
          onClick={null}>
          Back
        </Button>

        <Button
          disabled={!fontFiles.every((ff) => ff.src)}
          endIcon={<ArrowForward />}
          color="primary"
          variant="contained"
          onClick={() => onSubmit(fontFiles)}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

const FontUploadItem = ({ value, onChange, onRemove }) => {
  const { name, src } = value;
  return (
    <Box key={name}>
      <ListItem>
        <ListItemText
          primary={name}
          secondary={src ? <ResolvedText /> : "Upload or Ignore to continue"}
        />
        <ListItemSecondaryAction>
          <Button onClick={() => onRemove(name)} color="secondary">
            Ignore
          </Button>
        </ListItemSecondaryAction>
      </ListItem>
      <FileUploader
        value={src}
        name={name}
        uploadDirectory={"fonts"}
        onChange={(v) => onChange(name, v)}
        accept={".ttf,.otf"}
        onError={null}
      />
    </Box>
  );
};

const ResolvedText = () => (
  <>
    <DoneIcon style={{ paddingTop: 10 }} color={"green"} size="small" />
    <Typography variant="span" style={{ color: "green" }}>
      Resolved
    </Typography>
  </>
);
