import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import React from "react";
import { useHistory } from "react-router-dom";
import useApi from "services/api";
export default props => {
  const { edit, video } = props?.location?.state ?? null;
  const videoTemplateId = video?.videoTemplateId ?? null;
  const history = useHistory();
  const [isEditing, setIsEditing] = React.useState(false);
  const creatorId = "sjjsjjjkaaaa";
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (loading | isEditing)
    return <p>{isEditing ? "Editing " : "submitting "}your template...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h4>{edit ? "Edit your Video Template" : "Add Video Template"}</h4>
      <hr />
      <FormBuilder
        edit={edit}
        video={video}
        submitForm={() => console.log("submitting")}
      />
    </div>
  );
};

// const handleEditForm = async data => {
//   console.log(data);
//   // here comes edited obj from form
//   var editedObj = {
//     creatorId: "sjjsjjjkaaaa",
//     tags: ["test", "react"],
//     versions: [
//       {
//         comp_name: "main",
//         title: "testing Form",
//         description: "a testing Form description",
//         price: 10,
//         sample:
//           "http://d1hzn67dcj6z9o.cloudfront.net/sample-videos/cute_animated.mp4",
//         form: { segments: data }
//       }
//     ],
//     title: "edited test title",
//     description: "edited test form description"
//   };
//   var action = window.confirm("Are you sure, you want to save changes");
//   if (action) {
//     try {
//       setIsEditing(true);
//       const response = await fetch(
//         process.env.REACT_APP_API_URL +
//           `/video/creator/${creatorId}/${videoTemplateId}`,
//         {
//           method: "PUT",
//           body: JSON.stringify(editedObj),
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `bearer ${localStorage.getItem("jwtoken")}`
//           }
//         }
//       );
//       setIsEditing(false);
//       if (response.ok) {
//         history.push("/home/videoTemplates");
//         //TOOD
//         // to be handled in backend return the edited video object in response
//         // const editedVideo = await response.json();
//         // refresh the page with updated props
//         // history.push({
//         //   pathname:document.location.pathname,
//         //   state:{video:editedVideo}
//         // })
//       }
//     } catch (err) {
//       setIsEditing(false);
//       alert(err);
//     }
//   }
// };
// const handleSubmitForm = async data => {
//   var obj = {
//     creatorId,
//     tags: ["test", "react"],
//     versions: [
//       {
//         comp_name: "main",
//         title: "testing Form",
//         description: "a testing Form description",
//         price: 10,
//         sample:
//           "http://d1hzn67dcj6z9o.cloudfront.net/sample-videos/cute_animated.mp4",
//         form: { segments: data }
//       }
//     ],
//     title: "test title",
//     description: "test form description"
//   };
//   try {
//     setLoading(true);
//     const response = await fetch(
//       process.env.REACT_APP_API_URL + `/creator/${creatorId}/videoTemplates`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ ...obj })
//       }
//     );
//     setLoading(false);
//     if (response.ok) {
//       history.push("/home/videoTemplates");
//     }
//   } catch (err) {
//     setError(err);
//   }
// };
