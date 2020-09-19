import { Alert } from "@material-ui/lab";
import { Job, VideoTemplate, Creator } from "services/api";
import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import { StateProvider, VideoTemplateContext } from "contextStore/store";
import React, { useState, useContext } from "react";
import { Prompt, useHistory } from "react-router-dom";

const AddTemplate = ({ location }) => {
  const [isBlocking, setIsBlocking] = useState(true);
  const [error, setError] = useState(null);
  const [videoObj] = useContext(VideoTemplateContext);

  const { video, isEdit, draftIndex = null } = location?.state ?? {};
  const history = useHistory();
  console.log("jwt token is" + localStorage.getItem("jwtoken"));

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
              message: `Video Template ${isEdit ? "Edited" : "Added"
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
    <>
      {error && <Alert severity="error" children={error.message} />}
      <Prompt when={isBlocking} message={(location, action) => {
        console.log(action)
        if (action && !isEdit) {
          const confirm = window.confirm("Save template as draft?")
          if (confirm) {
            const temp = localStorage.getItem('draftTemplates') ? JSON.parse(localStorage.getItem('draftTemplates')) : []
            if (draftIndex !== null) {
              localStorage.setItem('draftTemplates', JSON.stringify(temp.map((item, index) => draftIndex === index ? ({ ...videoObj, draftedAt: new Date() }) : item)
              ))
            } else {
              temp.push({ ...videoObj, draftedAt: new Date() })
              localStorage.setItem('draftTemplates', JSON.stringify(temp))
            }
          } else {
            console.log('Exit')
          }
        } else return `You will lose all your data.`
      }} />
      <FormBuilder isEdit={isEdit} isDrafted={draftIndex !== null} video={video} submitForm={handleSubmit} />
    </>
  );
};

export default (props) => <StateProvider><AddTemplate {...props} /></StateProvider>