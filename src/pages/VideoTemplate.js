import React from "react";
import { Button, Typography, Paper, LinearProgress, withStyles } from "@material-ui/core";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import useApi, { deleteTemplate } from "services/api";
import ErrorHandler from 'components/ErrorHandler'

const CustomProgress = withStyles({
  colorPrimary: {
    backgroundColor: "#b2dfdb",
  },
  barColorPrimary: {
    backgroundColor: "#00695c",
  },
})(LinearProgress);

export default (props) => {
  const { url } = useRouteMatch();
  const { id } = useParams();

  const [isDeleting, setIsDeleting] = React.useState(false);

  const history = useHistory();
  const { data, loading, error } = useApi(`/videoTemplates/${id}`);

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
    var action = window.confirm("Are you sure, you want to delete");
    if (action) {
      try {
        setIsDeleting(true);
        const response = await deleteTemplate(id)
        setIsDeleting(false);
        if (response.ok) {
          console.log(await response.json());
          history.goBack();
        }
      } catch (err) {
        setIsDeleting(false);
        alert(err.message);
      }
    }
  };

  if (error) return <ErrorHandler
    message={error?.message ?? "Oop's, Somethings went wrong!"}
    showRetry={true}
    onRetry={() => alert("retrying")} />

  return (
    <div>
      {(loading | isDeleting) ? <CustomProgress /> : ""}
      <Paper style={{ padding: 20, }}>
        <Typography variant="h4" style={{ marginTop: 10 }}>Your Video Template</Typography>
        <Typography style={{ marginTop: 10 }}><strong>Sample Video</strong></Typography>
        <video
          id="sample"
          controls={true}
          style={{ width: 300, height: 200, marginTop: 10 }}
          src={data?.versions[0]?.sample}
        />

        <Typography style={{ marginTop: 10 }}><strong>Title</strong></Typography>
        <Typography>{data?.title}</Typography>
        <Typography style={{ marginTop: 10 }}><strong>Description</strong></Typography>
        <Typography>{data?.description}</Typography>

        <Button style={{ margin: 10, marginLeft: 0 }} variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
        <Button style={{ margin: 10, }}
          disabled={isDeleting}
          variant="outlined"
          color="secondary" onClick={handleDelete}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
      </Paper ></div>

  );
};
