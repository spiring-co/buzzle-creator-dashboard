import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import { StateProvider } from "contextStore/store";
import React from "react";
import { Prompt, useHistory } from "react-router-dom";
export default (props) => {
  const [isBlocking, setIsBlocking] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { video } = props?.location?.state ?? {};

  const isEdit = props?.location?.state?.isEdit ?? false;
  const history = useHistory();

  const handleEditForm = async (data) => {
    var action = window.confirm("Are you sure, you want to save changes");
    if (action) {
      try {
        setIsEditing(true);
        const response = await fetch(
          process.env.REACT_APP_API_URL + `/videoTemplates/${data.id}`,
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
    alert("saving...");
    console.log(data);
    try {
      setLoading(true);
      const response = await fetch(
        process.env.REACT_APP_API_URL + `/videoTemplates`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      setLoading(false);
      if (response.ok) {
        setIsBlocking(false);
        history.push("/home/videoTemplates");
      }
    } catch (err) {
      setLoading(false);

      setError(err);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  if (loading || isEditing)
    return <p>{isEditing ? "Editing" : "Submitting"} your template...</p>;

  return (
    <StateProvider>
      <Prompt when={isBlocking} message={`You will lose all your data.`} />
      <h3 className="text-center mb-4">
        {isEdit ? "Edit Your " : "Add"} Video Template
      </h3>
      <FormBuilder
        isEdit={isEdit}
        video={video}
        submitForm={isEdit ? handleEditForm : handleSubmitForm}
      />
    </StateProvider>
  );
};
