import React, { useState } from "react";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";

import { VideoTemplate } from "services/api";
import useApi from "services/apiHook";
import {
  Button,
  Typography,
  Paper,
  LinearProgress,
  withStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

export default () => {
  const { url } = useRouteMatch();
  const { id } = useParams();
  const history = useHistory();

  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { data, loading, err } = useApi(`/videoTemplates/${id}`);

  const handleEdit = async () => {
    history.push({
      pathname: `${url}/edit`,
      state: {
        isEdit: true,
        video: data,
      },
    });
  };

  const handleDelete = async () => {
    const action = window.confirm("Are you sure, you want to delete");
    if (!action) return;

    try {
      setIsDeleting(true);
      await VideoTemplate.delete(id);
    } catch (err) {
      setError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (err) setError(err);

  return (
    <div>
      {loading || isDeleting ? <CustomProgress /> : ""}
      {error && <Alert severity="error" children={`${error.message}`} />}
      {/* TODO use material classes, no inline styling */}
      <Paper style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginTop: 10 }}>
          Your Video Template
        </Typography>
        <Typography style={{ marginTop: 10 }}>
          <strong>Sample Video</strong>
        </Typography>
        <video
          id="sample"
          controls={true}
          style={{ width: 300, height: 200, marginTop: 10 }}
          src={data?.versions[0]?.sample}
        />

        <Typography style={{ marginTop: 10 }}>
          <strong>Title</strong>
        </Typography>
        <Typography>{data?.title}</Typography>
        <Typography style={{ marginTop: 10 }}>
          <strong>Description</strong>
        </Typography>
        <Typography>{data?.description}</Typography>

        <Button
          style={{ margin: 10, marginLeft: 0 }}
          variant="contained"
          color="primary"
          onClick={handleEdit}>
          Edit
        </Button>
        <Button
          component={"a"}
          target="_blank"
          style={{ margin: 10, marginLeft: 0 }}
          variant="contained"
          color="primary"
          href={data?.src || ""}>
          Download AEP(X)
        </Button>
        <Button
          style={{ margin: 10 }}
          disabled={isDeleting}
          variant="outlined"
          color="secondary"
          onClick={handleDelete}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Paper>
    </div>
  );
};