import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

const FilePicker = ({ setCompositions, setTextLayers }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const extractService = async (fileObj) => {
    setError(null);
    var data = new FormData();
    try {
      data.append("aepFile", fileObj);
      setLoading(true);
      const response = await fetch(
        "http://localhost:4488/getStructureFromFile",
        {
          method: "POST",
          body: data,
        }
      );
      setLoading(false);

      if (response.ok) {
        const { data } = await response.json();
        setCompositions(data.comps);
        setTextLayers(data.textLayers);

        setFile(fileObj.name);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err);
    }
  };
  const pickFile = (e) => {
    try {
      var cFile = e.target.files[0];
      extractService(cFile);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <label class="file_input">
        <h1 style={{ marginTop: 36, paddingBottom: 0, border: 0 }}>
          Please wait, While We Doing Our Magic ...
        </h1>
        {/* <img
            style={{ width: "40%", height: "40%" }}
            src={require("../assets/blackUpload.svg")}
          /> */}
      </label>
    );
  }
  if (file === null)
    return (
      <div style={{ position: "relative", left: "17%" }}>
        <Card
          className="text-center"
          style={{
            width: "60%",
            height: "30vh",
            marginBottom: "2vh",
          }}
        >
          <Card
            style={{
              marginTop: "4vh",
              marginRight: "5vh",
              marginLeft: "5vh",
              height: "70%",
              border: "dashed grey 1px",
            }}
          >
            <Card.Body
              as="label"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(ev) => {
                ev.preventDefault();
                var dFile = ev.dataTransfer.files[0];
                extractService(dFile);
              }}
              for="apex_input"
              class="file_input"
            >
              {error && (
                <text style={{ color: "red" }}>
                  Some Error Occured, Please Retry
                </text>
              )}

              <Card.Title style={{ marginTop: "8vh" }}>
                Drag files here to upload
              </Card.Title>

              <input
                onChange={pickFile}
                id="apex_input"
                style={{ display: "none" }}
                type="file"
                accept={[".aepx", ".aep"]}
              />
            </Card.Body>
          </Card>
        </Card>

        <img src={require("../assets/success.svg")} />
        <h1>{file} Uploaded Successfully.</h1>
      </div>
    );
};

export default function FilePickerScreen(props) {
  return <FilePicker {...props} />;
}
