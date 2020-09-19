import React, { useState } from "react";
import { Container } from "@material-ui/core";

import Meta from "components/videoTemplateBuilder/Meta";
import Versions from "components/videoTemplateBuilder/Versions";
import Fonts from "components/videoTemplateBuilder/Fonts";
import StaticAssets from "components/videoTemplateBuilder/StaticAssets";

export default function AddVideoTempate({
  src,
  staticAssets,
  fonts,
  value,
  onSubmit,
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [videoTemplate, setVideoTemplate] = useState(value);

  const handleMeta = (meta) => {
    console.log(meta);
    setActiveStepIndex(activeStepIndex + 1);
    setVideoTemplate({ ...videoTemplate, meta });
  };

  const handleVersions = (v) => {
    console.log(v);
    setActiveStepIndex(activeStepIndex + 1);
    setVideoTemplate({ ...videoTemplate, v });
  };

  const handleFonts = (v) => {
    console.log(v);
    setActiveStepIndex(activeStepIndex + 1);
    setVideoTemplate({ ...videoTemplate, v });
  };

  const handleStaticAssets = (v) => {
    console.log(v);
    setActiveStepIndex(activeStepIndex + 1);
    onSubmit();
  };

  const steps = [
    <Fonts
      key={"fonts"}
      fonts={["Poppins", "Raleway"]}
      value={[]}
      onSubmit={handleFonts}
    />,
    <Meta key={"meta"} value={{}} onSubmit={handleMeta} />,
    <Versions key={"versions"} value={{}} onSubmit={handleVersions} />,
    <StaticAssets
      key={"static"}
      files={staticAssets}
      value={null}
      onSubmit={handleStaticAssets}
    />,
  ];

  return <Container>{steps[activeStepIndex]}</Container>;
}
