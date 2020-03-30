import React from "react";
import { useHistory } from "react-router-dom";
import useApi from "services/api";
export default props => {
  console.log(props.location.state.video);
  const videoTemplateId = props.location.state.video.videoTemplateId;
  const segments = props.location.state.video.versions[0].form.segments;
  console.log(segments);
  //fetch creator id from localstorage
  const creatorId = "sjjsjjjkaaaa";
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const history = useHistory();
  const { data, loading, error } = useApi(`/video/${videoTemplateId}`);

  const handleEdit = async () => {
    // here comes edited obj from form
    var editedObj = {
      creatorId: "sjjsjjjkaaaa",
      tags: ["test", "react"],
      versions: [
        {
          comp_name: "main",
          title: "testing Form",
          description: "a testing Form description",
          price: 10,
          sample:
            "http://d1hzn67dcj6z9o.cloudfront.net/sample-videos/cute_animated.mp4",
          form: { segments }
        }
      ],
      title: "edited test title",
      description: "edited test form description"
    };
    var action = window.confirm("Are you sure, you want to save changes");
    if (action) {
      try {
        setIsEditing(true);
        const response = await fetch(
          process.env.REACT_APP_API_URL +
            `/video/creator/${creatorId}/${videoTemplateId}`,
          {
            method: "PUT",
            body: JSON.stringify(editedObj),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("jwtoken")}`
            }
          }
        );
        setIsEditing(false);
        if (response.ok) {
          //TOOD
          // to be handled in backend return the edited video object in response
          // const editedVideo = await response.json();
          // refresh the page with updated props
          // history.push({
          //   pathname:document.location.pathname,
          //   state:{video:editedVideo}
          // })
        }
      } catch (err) {
        setIsEditing(false);
        alert(err);
      }
    }
  };

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
  if (loading | isDeleting | isEditing)
    return (
      <p>
        {isDeleting ? "Deleting" : isEditing ? "Editing" : "Loading"} your
        template...
      </p>
    );
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

      <button onClick={handleEdit}>Edit</button>
      <span> </span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};
