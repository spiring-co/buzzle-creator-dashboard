import React from "react";
import { useHistory } from "react-router-dom";
import useApi from "services/api";
export default props => {
  const videoTemplateId = props.location.state.videoTemplateId;
  //fetch creator id from localstorage
  const creatorId = "sjjsjjjkaaaa";
  const [isDeleting, setIsDeleting] = React.useState(false);
  const history = useHistory();
  const { data, loading, error } = useApi(`/video/${videoTemplateId}`);
  const handleDelete = async () => {
    var action = window.confirm("Are you sure, you want to delete");
    if (action) {
      try {
        setIsDeleting(true);
        const response = await fetch(
          process.env.REACT_APP_API_URL +
            `/video/creator/${creatorId}/${videoTemplateId}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("jwtoken")}`
            }
          }
        );
        setIsDeleting(false);
        if (response.ok) {
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
    <div>
      <h2>Your Video Template</h2>
      <h3 for="sample">Sample Video</h3>
      <video
        id="sample"
        controls={true}
        style={{ width: 300, height: 200 }}
        src={data.versions[0].sample}
      />

      <h3 for="title">Title</h3>
      <p style={{ color: "blue" }} id="title">
        {data.title}
      </p>
      <h3 for="desc">Description</h3>
      <p style={{ color: "blue" }} id="desc">
        {data.description}
      </p>

      <button>Edit</button>
      <span> </span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
