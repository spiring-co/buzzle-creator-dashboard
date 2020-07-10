import { Alert } from "@material-ui/lab";
import { apiClient } from "buzzle-sdk";
import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import { StateProvider } from "contextStore/store";
import React, { useState } from "react";
import { Prompt, useHistory } from "react-router-dom";

const { VideoTemplate } = apiClient({
  baseUrl: process.env.REACT_APP_API_URL,
  authToken: localStorage.getItem("jwtoken"),
});

export default ({ location }) => {
  const [isBlocking, setIsBlocking] = useState(true);
  const [error, setError] = useState(null);

  const { video, isEdit } = location?.state ?? {};

  const history = useHistory();

  const handleSubmit = async (data) => {
    console.log(data);
    try {
      isEdit
        ? await VideoTemplate.update(data.id, data)
        : await VideoTemplate.create(data);

      setIsBlocking(false);
      history.push({
        pathname: "/home/videoTemplates",
        state: {
          statusObj: {
            status: {
              message: `Video Template ${
                isEdit ? "Edited" : "Added"
              } Successfully.`,
            },
            err: false,
          },
        },
      });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <StateProvider>
      {error && <Alert severity="error" children={error.message} />}
      <Prompt when={isBlocking} message={`You will lose all your data.`} />
      <FormBuilder isEdit={isEdit} video={video} submitForm={handleSubmit} />
    </StateProvider>
  );
};
