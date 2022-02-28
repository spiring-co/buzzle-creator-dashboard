import React, { useContext, useState, useEffect } from "react";
import { Paper, Container, Box } from "@material-ui/core";

import useActions from "contextStore/actions";
import { VideoTemplateContext } from "contextStore/store";
import AlertHandler from "common/AlertHandler";
import AssetUpload from "./AssetUpload";
import FontUpload from "./FontUpload";
import FormStepper from "./FormStepper";
import VersionDisplay from "./VersionDisplay";
import VideoTemplateMetaForm from "./VideoTemplateMetaForm";

import { useAuth } from "services/auth";
import { VideoTemplate } from "services/buzzle-sdk/types";
import { getLayersFromComposition } from "helpers";
type IProps = {
  submitForm: Function, isEdit?: boolean, isDrafted?: boolean,
  video: VideoTemplate,
  type: 'ae' | "remotion"
}
export default ({ submitForm, isEdit, isDrafted = false, video, type }: IProps) => {
  const { user } = useAuth();
  const [videoObj] = useContext(VideoTemplateContext);
  const { resetVideo, editVideoKeys, loadVideo } = useActions();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeDisplayIndex, setActiveDisplayIndex] = useState<number>(0);
  const [compositions, setCompositions] = useState<Array<any>>([]);
  const [error, setError] = useState<Error | null>(null);
  const [fonts, setFonts] = useState<Array<{ name: string, src: string }>>([])
  const [assets, setAssets] = useState<Array<{ name: string, type: string, src: string }>>([])
  const [isAssetNavigated, setIsAssetNavigated] = useState<boolean>(false)
  const [isFontNavigated, setIsFontNavigated] = useState<boolean>(false)
  const handleSubmitForm = async () => {
    try {
      setError(null);
      setLoading(true);
      await submitForm(videoObj);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as Error);
    }
  };

  const handleVideoTemplateMetaSubmit = async ({
    keywords,
    title,
    orientation,
    description,
    thumbnail,
    projectFile: { fileUrl = "", staticAssets = [], compositions = [] },
  }: {
    keywords: Array<string>,
    title: string,
    orientation: 'portrait' | "landscape",
    description: string,
    thumbnail: string,
    projectFile: { fileUrl: string, staticAssets: Array<{ name: string, type: 'static', src: string }>, compositions: Array<any> },
  }) => {
    const savedStaticAssetNames = isEdit ? (video?.staticAssets ?? [])?.map(({ name }) => name) : []
    setCompositions(compositions);
    const allTextLayers = Object.values(compositions)
      .map((c) => getLayersFromComposition(c, "textLayers"))
      .flat();
    const fontNames: Array<string> = []
    allTextLayers.map(({ font = "" }) => {
      if (!fontNames.includes(font)) {
        fontNames.push(font)
      }
    })
    const sAssets = isEdit
      ? staticAssets.map((asset, index) => (video?.staticAssets ?? [])?.find(({ name }) => name === asset.name) || asset) : staticAssets
    const fontsTemp = fontNames.map((fontName) => ({
      name: fontName,
      src: (video?.fonts ?? [])?.find(({ name }) => name === fontName)?.src || "",
    }))
    setAssets(sAssets)
    setFonts(fontsTemp)

    editVideoKeys({
      ...((isEdit || isDrafted) ? {} : { type }),
      keywords,
      title,
      orientation,
      description,
      src: fileUrl,
      thumbnail,
      fonts: fontsTemp,
      staticAssets: sAssets,
    });
    setActiveDisplayIndex(1);
  };
  const Steps = [<VideoTemplateMetaForm
    type={(isEdit || isDrafted) ? video?.type : type}
    isEdit={isEdit || isDrafted}
    assets={videoObj.staticAssets}
    compositions={compositions}
    initialValues={
      isEdit || isDrafted
        ? { ...video, projectFile: video?.src ?? "" }
        : { ...videoObj, projectFile: videoObj?.src ?? "" }
    }
    onSubmit={handleVideoTemplateMetaSubmit}
  />,
  <VersionDisplay
    isEdit={isEdit || isDrafted}
    compositions={compositions}
    activeDisplayIndex={activeDisplayIndex}
    setActiveDisplayIndex={setActiveDisplayIndex}
    isSubmitting={loading}
    handleSubmitForm={handleSubmitForm}
    submitError={error}
  />,
  ...(((isEdit || isDrafted) ? video?.type : type) === 'ae' ? [
    <FontUpload
      isFontNavigated={isFontNavigated}
      setIsFontNavigated={setIsFontNavigated}
      compositions={compositions}
      setActiveDisplayIndex={setActiveDisplayIndex}
      activeDisplayIndex={activeDisplayIndex}
      fonts={fonts}
    />
    , <AssetUpload
      isAssetNavigated={isAssetNavigated}
      setIsAssetNavigated={setIsAssetNavigated}
      isSubmitting={loading}
      handleSubmitForm={handleSubmitForm}
      submitError={error}
      setActiveDisplayIndex={setActiveDisplayIndex}
      activeDisplayIndex={activeDisplayIndex}
      staticAssets={assets}
    />
  ] : [])
  ]
  useEffect(() => {
    if (isEdit || isDrafted) {
      loadVideo(video);
    } else {
      resetVideo(user?.id, type);
    }
  }, [isDrafted, isEdit]);
  return (
    <Box>
      {error !== null ? <AlertHandler severity="error" message={error?.message || "Oop's, something went wrong, action failed !"} /> : <div />}
      <FormStepper type={(isEdit || isDrafted) ? video?.type : type} activeDisplayIndex={activeDisplayIndex} />
      <Paper elevation={2} style={{ padding: 32 }}>
        {Steps[activeDisplayIndex]}
      </Paper>
    </Box>
  );
};
