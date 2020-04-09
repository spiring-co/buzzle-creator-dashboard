import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import React from "react";
import { Prompt, useHistory } from "react-router-dom";
import useApi from "services/api";
export default props => {
  let [isBlocking, setIsBlocking] = React.useState(true);
  const { edit, video } = props?.location?.state ?? null;
  const videoTemplateId = video?.videoTemplateId ?? null;
  const history = useHistory();
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const creatorId = "sjjsjjjkaaaa";
  const handleEditForm = async data => {
    console.log(data);
    // here comes edited obj from form

    var action = window.confirm("Are you sure, you want to save changes");
    if (action) {
      try {
        setIsEditing(true);
        const response = await fetch(
          process.env.REACT_APP_API_URL + `/video/${videoTemplateId}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
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
          setIsBlocking(false);
          history.push({
            pathname: `/home/videoTemplates/${data.videoTemplateId}`,
            state: { video: data }
          });
        }
      } catch (err) {
        setIsEditing(false);
        alert(err);
      }
    }
  };
  const handleSubmitForm = async data => {
    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_API_URL + `/video`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      setLoading(false);
      if (response.ok) {
        setIsBlocking(false);
        history.push("/home/videoTemplates");
      }
    } catch (err) {
      setError(err);
    }
  };

  if (loading | isEditing)
    return <p>{isEditing ? "Editing " : "submitting "}your template...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <Prompt when={isBlocking} message={`You will lose all your data.`} />
      <h4>{edit ? "Edit your Video Template" : "Add Video Template"}</h4>
      <hr />
      <FormBuilder
        edit={edit}
        video={video}
        submitForm={edit ? handleEditForm : handleSubmitForm}
      />
    </div>
  );
};
