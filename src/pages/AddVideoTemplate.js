import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import React from "react";
import Container from "react-bootstrap/Col";
import { Prompt, useHistory, useLocation } from "react-router-dom";
export default (props) => {
  const [isBlocking, setIsBlocking] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { pathname } = useLocation();
  const { video } = props?.location?.state ?? {};
  const videoTemplateId = video?.videoTemplateId ?? null;

  const edit = pathname.includes("edit");
  const history = useHistory();

  const handleEditForm = async (data) => {
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
              Authorization: `bearer ${localStorage.getItem("jwtoken")}`,
            },
          }
        );
        setIsEditing(false);
        if (response.ok) {
          setIsBlocking(false);
          history.push({
            pathname: `/home/videoTemplates/${data.videoTemplateId}`,
            state: { video: data },
          });
        }
      } catch (err) {
        setIsEditing(false);
        alert(err);
      }
    }
  };
  const handleSubmitForm = async (data) => {
    try {
      setLoading(true);
      const response = await fetch(process.env.REACT_APP_API_URL + `/video`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
      if (response.ok) {
        setIsBlocking(false);
        history.push("/home/videoTemplates");
      }
    } catch (err) {
      alert(JSON.stringify(err));
      setError(err);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  if (loading || isEditing)
    return <p>{isEditing ? "Editing" : "Submitting"} your template...</p>;
  return (
    <Container fluid className="mb-5">
      <Prompt when={isBlocking} message={`You will lose all your data.`} />
      <h3 className="text-center mb-4">
        {edit ? "Edit Your " : "Add"} Video Template
      </h3>
      <FormBuilder
        edit={edit}
        video={video}
        submitForm={edit ? handleEditForm : handleSubmitForm}
      />
    </Container>
  );
};
