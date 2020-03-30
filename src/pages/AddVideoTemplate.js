import FormBuilder from "components/formSchemaBuilderComponents/FormBuilder";
import React from "react";
import { useHistory } from "react-router-dom";
import useApi from "services/api";
export default () => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleSubmitForm = async segments => {
    var obj = {
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
      title: "test title",
      description: "test form description"
    };
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3000/creator/sjjsjjjkaaaa/videoTemplates",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...obj })
        }
      );
      setLoading(false);
      if (response.ok) {
        console.log(response);

        history.push("/home/videoTemplates");
      }
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <p>Submitting your template...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <h4>Add Video Template Page</h4>
      <hr />
      <FormBuilder submitForm={handleSubmitForm} />
    </div>
  );
};
