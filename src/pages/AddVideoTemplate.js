import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import { StateProvider } from "contextStore/store";
import React, { useState } from "react";
import { Prompt, useHistory } from "react-router-dom";


export default (props) => {
  const [isBlocking, setIsBlocking] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [status, setStatus] = useState(false)
  const { video } = props?.location?.state ?? {};

  const isEdit = props?.location?.state?.isEdit ?? false;
  const history = useHistory();

  const handleEditForm = async (data) => {
    console.log(data);
    var action = window.confirm("Are you sure, you want to save changes");
    if (action) {
      try {
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
        if (response.ok) {
          setStatus(true)
          setIsBlocking(false);
          history.push({
            pathname: `/home/videoTemplates/${data.id}`,
            state: { statusObj: { status: { message: "Video Template Edited Successfully." }, err: false } }
          });
        } else {
          setError(await response.text())
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  };
  const handleSubmitForm = async (data) => {
    try {
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
      if (response.ok) {
        setStatus(true)
        setIsBlocking(false);
        history.push({
          pathname: "/home/videoTemplates",
          state: { statusObj: { status: { message: "Video Template Created  Successfully." }, err: false } }
        });
      } else {
        setError(await response.text())
      }
    } catch (err) {
      throw new Error(err)
    }
  };

  return (
    <StateProvider>

      <Prompt when={isBlocking} message={`You will lose all your data.`} />
      <FormBuilder
        isEdit={isEdit}
        video={video}
        submitForm={isEdit ? handleEditForm : handleSubmitForm}
      />
    </StateProvider>
  );
};
