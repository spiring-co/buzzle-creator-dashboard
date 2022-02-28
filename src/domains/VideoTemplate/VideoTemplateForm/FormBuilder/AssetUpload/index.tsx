import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { SubHeading } from "common/Typography";
import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { VideoTemplate } from "services/buzzle-sdk/types";
import AssetUploader from "./AssetUploader";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
  },
}));
type IProps = {
  staticAssets: Array<{ name: string, type: string, src: string }>,
  activeDisplayIndex: number,
  setActiveDisplayIndex: (value: number) => void,
  isSubmitting: boolean,
  submitError: Error | null,
  handleSubmitForm: Function,
  isAssetNavigated: boolean,
  setIsAssetNavigated: Function,
}
type asset = { name: string, type: 'static', src: File | string }
export default function AssetUpload({
  staticAssets,
  activeDisplayIndex,
  setActiveDisplayIndex,
  isAssetNavigated,
  setIsAssetNavigated,
  isSubmitting,
  submitError,
  handleSubmitForm,
}: IProps) {
  const classes = useStyles();

  const [isValid, setIsValid] = useState(false);

  const [videoObj]: Array<VideoTemplate> = useContext(VideoTemplateContext);
  const { editVideoKeys } = useActions();
  const { enqueueSnackbar } = useSnackbar()
  const [uploadType, setUploadType] = useState<"file" | "folder">(
    (staticAssets[0]?.src ?? false) === "" ? "folder" : "file"
  );

  const [assets, setAssets] = useState<Array<asset>>([]);
  const [isFolderResolved, setIsFolderResolved] = useState(typeof staticAssets[0]?.src !== "string" || !!staticAssets[0]?.src);
  useEffect(() => {
    setIsAssetNavigated(true)
    setAssets(!isAssetNavigated ? staticAssets?.map((oldAsset) => ((videoObj.staticAssets || []).find((item) => item.name === oldAsset.name) || oldAsset) as asset) : (videoObj.staticAssets || []) as Array<asset>)

  }, [])
  useEffect(() => {
    // set the value to global state of videoTemplate
    editVideoKeys({ staticAssets: assets });
    setIsValid(assets.every((i) => !!i.src));
  }, [assets]);
  const handleReset = () => {
    setAssets(staticAssets?.map((oldAsset) => ((videoObj.staticAssets || []).find((item) => item.name === oldAsset.name) || oldAsset) as asset))
  }
  const handleChange = (e: any) => {
    setUploadType(e.target.value);
  };

  const renderAssetFileUploader = () => {
    return (
      <Box mt={2}>
        <List className={classes.root}>
          {assets?.length !== 0 ? (
            assets?.map((asset, index) => (
              <>
                <AssetUploader
                  type={"file"}
                  assetsNames={[asset.name]}
                  key={asset.name}
                  handleDelete={() => {
                    setAssets(assets.filter(({ name }, i) => name !== asset.name));
                  }}
                  setAssets={(src) => {
                    if (typeof src === "string") {

                      setAssets(assets =>
                        assets?.map((item, i) =>
                          item?.name === asset?.name ? { ...item, src } : item)
                      )
                    }


                  }}
                  asset={asset}
                  isFolderResolved={isFolderResolved}
                />
                {index !== assets.length - 1 && <Divider />}
              </>
            ))
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              minHeight={200}>
              <Typography>No Assets Found!</Typography>
            </Box>
          )}
        </List>
      </Box>
    );
  };

  const renderAssetUploader = (uploadType: "folder" | "file") => {
    switch (uploadType) {
      case "folder":
        return (
          <List className={classes.root}>
            <AssetUploader
              type={uploadType}
              assetsNames={assets.filter(value => !value.src)?.map(({ name }) => name)}
              setAssets={(src) => {
                if (typeof src !== 'string') {
                  if (!src.length) {
                    enqueueSnackbar("No asset present in this folder, Upload your asset individually", {
                      variant: 'warning',
                    })
                  }
                  setAssets(assets => assets.map((item) => ({
                    ...item,
                    src: src.find((file) => item.name === file.name)?.src || item?.src || ""
                  })));
                  setIsFolderResolved(true);
                  setUploadType("file");
                }
              }}
              asset={{ name: "Asset Folder", src: "", type: 'static' }}
              isFolderResolved={isFolderResolved}
            />
          </List>
        );
      case "file":
        return renderAssetFileUploader();

      default:
        return;
    }
  };


  return (
    <Box>
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SubHeading>Upload Asset Files</SubHeading>
        <IconButton onClick={handleReset}>
          <RotateLeftIcon />
        </IconButton>
      </Box>
      <FormControl style={{ marginTop: 5 }} component="fieldset">
        <FormLabel component="legend">
          Choose Asset Upload Structure
        </FormLabel>
        <RadioGroup value={uploadType} onChange={handleChange} row>
          <FormControlLabel
            value="folder"
            control={<Radio />}
            label="Complete Assets Folder"
          />
          <FormControlLabel
            value="file"
            control={<Radio />}
            label="Individual Assets"
          />
        </RadioGroup>
      </FormControl>
      {/* ) : <div />} */}
      {renderAssetUploader(uploadType)}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          startIcon={<ArrowBack />}
          style={{ margin: 10 }}
          color="primary"
          variant="outlined"
          children={"Back"}
          onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
        />
        <Button
          endIcon={isSubmitting && <CircularProgress color="inherit" size={20} />}
          disabled={isSubmitting || !isValid}
          style={{ margin: 10 }}
          color={submitError ? "secondary" : "primary"}
          variant={submitError ? "outlined" : "contained"}
          children={
            submitError ? "Retry" : isSubmitting ? "Submitting" : "Submit"
          }
          onClick={() => handleSubmitForm(videoObj)}
        />
      </Box>
    </Box>
  );
}
