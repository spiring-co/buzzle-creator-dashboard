import React from "react";
import { Typography, Box } from "@material-ui/core";
import spiring_black from "assets/spiring.svg";
import spiring_white from "assets/spiring_grey.svg";
import { useDarkMode } from "helpers/useDarkMode";

export default ({ mt }: { mt?: number }) => {
  const [theme] = useDarkMode();
  return (
    <Box
      style={{
        marginTop: mt ? mt : 10,
        textAlign: "center",
        // position: "relative",
        paddingTop: 30,
        paddingBottom: 30,
        bottom: 32,
        width: "100%",
      }}>
      <img
        style={{ height: 36 }}
        src={theme === "light" ? spiring_black : spiring_white}
      />
      <Typography
        style={{
          fontSize: 12,
          fontWeight: 700,
        }}>
        Copyright © 2020 All Rights Reserved.
      </Typography>
    </Box>
  );
};
