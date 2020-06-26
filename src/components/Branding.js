import React from "react";
import { Typography, Box } from "@material-ui/core";
import spiring from "assets/spiring.svg";
import spiring_grey from "assets/spiring_grey.svg";

export default ({ dark, mt }) => (
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
    <img style={{ height: 36 }} src={dark ? spiring_grey : spiring} />
    <Typography
      style={{
        color: dark ? "#747d8c" : "white",
        fontSize: 12,
        fontWeight: 700,
      }}>
      Copyright © 2020 All Rights Reserved.
    </Typography>
  </Box>
);
