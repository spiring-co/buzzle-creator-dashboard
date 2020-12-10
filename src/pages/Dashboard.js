import React from "react";
import { Typography } from "@material-ui/core";
import useApi from "services/apiHook";

export default () => {
  return (
    <div>
      <Typography variant="h4">Hello Creator!</Typography>
      <Typography>
        Generic dashboard here with charts and graphs and an overview.
      </Typography>
    </div>
  );
};
