import React from "react";
import { Typography, Box } from "@material-ui/core";
import spiring from "assets/spiring.svg";
import spiring_grey from "assets/spiring_grey.svg";

export default ({ dark }) => (
  <Box
    style={{
      textAlign: "center",
      position: "fixed",
      bottom: 32,
      width: "100%",
    }}>
    <img style={{ height: 36 }} src={dark ? spiring_grey : spiring} />
    <Typography
      style={{
        color: dark ? "#616161" : "white",
        fontSize: 12,
        fontWeight: 700,
      }}>
      Copyright © 2020 All Rights Reserved.
    </Typography>
  </Box>
);
