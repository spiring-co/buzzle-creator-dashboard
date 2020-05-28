import React from "react";
import { Button, Typography, Container } from "@material-ui/core";
import { useHistory, useRouteMatch, useParams } from "react-router-dom";
import useApi from "services/api";
export default (props) => {
  const { url } = useRouteMatch();
  const { id } = useParams();

  const [isDeleting, setIsDeleting] = React.useState(false);

  const history = useHistory();
  const { data, loading, error } = useApi(`/videoTemplates/${id}`);

  const handleEdit = async () => {
    // TODO handle with API
    history.push({
      pathname: `${url}/edit`,
      state: {
        isEdit: true,
        video: props.location.state.video,
      },
    });
  };

  const handleDelete = async () => {
    var action = window.confirm("Are you sure, you want to delete");
    if (action) {
      try {
        setIsDeleting(true);
        const response = await fetch(
          process.env.REACT_APP_API_URL +
            `/video/creator/${localStorage.getItem("creatorId")}/${id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
            },
          }
        );
        setIsDeleting(false);
        if (response.ok) {
          console.log(await response.json());
          history.goBack();
        }
      } catch (err) {
        setIsDeleting(false);
        console.log(err);
        alert(err.message);
      }
    }
  };
  if (loading | isDeleting)
    return <p>{isDeleting ? "Deleting" : "Loading"} your template...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container maxWidth={"md"}>
      <Typography variant="h3">Your Video Template</Typography>
      <Typography>Sample Video</Typography>
      <video
        id="sample"
        controls={true}
        style={{ width: 300, height: 200 }}
        src={data.versions[0].sample}
      />

      <Typography>Title</Typography>
      <Typography>{data.title}</Typography>
      <Typography>Description</Typography>
      <Typography>{data.description}</Typography>

      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </Container>
  );
};
