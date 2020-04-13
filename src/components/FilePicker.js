import React, { useEffect, useState } from "react";
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
      <label
        class="file_input"
        style={{
          margin: 20,
          padding: 20,
          borderRadius: 20,
          paddingTop: 100,
          paddingBottom: 100,
          display: "flex",
          flexDirection: "column",
          height: 350,
          boxShadow: "1px 1px 2px 2px lightgrey",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed grey",
        }}
      >
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
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(ev) => {
          ev.preventDefault();
          var dFile = ev.dataTransfer.files[0];
          extractService(dFile);
        }}
        for="apex_input"
        class="file_input"
        style={{
          margin: 30,
          padding: 20,
          borderRadius: 20,
          paddingTop: 100,
          paddingBottom: 100,
          display: "flex",
          flexDirection: "column",
          height: 350,
          boxShadow: "1px 1px 2px 2px lightgrey",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed grey",
        }}
      >
        {error && (
          <text style={{ color: "red" }}>Some Error Occured, Please Retry</text>
        )}
        <div>
          <img
            style={{ width: "40%", height: "40%" }}
            src={require("../assets/blackUpload.svg")}
          />
          <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 0 }}>
            Drag & Drop APEX File Here
          </p>
          <p style={{ fontSize: 15, fontWeight: "bold", marginTop: 0 }}>Or</p>
          <p class="choose_button">Choose File</p>
        </div>
        <input
          onChange={pickFile}
          id="apex_input"
          style={{ display: "none" }}
          type="file"
          accept={[".aepx", ".aep"]}
        />
      </label>
    );
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(ev) => {
        ev.preventDefault();
        var dFile = ev.dataTransfer.files[0];
        extractService(dFile);
      }}
      for="apex_input"
      class="file_input"
      style={{
        margin: 30,
        padding: 20,
        borderRadius: 20,
        paddingTop: 100,
        paddingBottom: 100,
        display: "flex",
        flexDirection: "column",
        height: 350,
        boxShadow: "1px 1px 2px 2px lightgrey",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        border: "2px dashed green",
      }}
    >
      <img
        style={{ width: "40%", height: "40%" }}
        src={require("../assets/success.svg")}
      />
      <h1
        style={{ color: "green", marginTop: 36, paddingBottom: 0, border: 0 }}
      >
        {file} Uploaded Successfully.
      </h1>
    </label>
  );
};

export default function FilePickerScreen(props) {
  return <FilePicker {...props} />;
}

const styles = {
  label: {
    margin: 30,
    padding: 20,
    borderRadius: 20,
    paddingTop: 100,
    paddingBottom: 100,
    display: "flex",
    flexDirection: "column",
    height: 350,
    boxShadow: "1px 1px 2px 2px lightgrey",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed grey",
  },
};
