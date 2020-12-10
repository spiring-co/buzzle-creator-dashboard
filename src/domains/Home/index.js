import React from "react";
import { Typography } from "@material-ui/core";
import useApi from "services/apiHook";

export default () => {
  const { data, loading, error } = useApi(
    "http://34.229.239.151:3050/api/v1/jobs",
    {
      headers: { "nexrender-secret": "myapisecret" },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
  return (
    <div>
      <Typography variant="h4">Hello Creator!</Typography>
      <Typography>
        Generic dashboard here with charts and graphs and an overview.
      </Typography>
    </div>
  );
};
