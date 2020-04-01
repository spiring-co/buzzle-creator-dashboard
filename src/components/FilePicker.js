import React, { useState, useEffect } from "react";
const FilePicker = () => {
  const [file, setFile] = useState(null);

  const pickFile = e => {
    try {
      const file = e.target.files[0];
      setFile(file.name);
      // const reader = new FileReader();
      // reader.onload = (function() {
      //   return function(e) {
      //     setFile(e.target.result);
      //   };
      // })(file);
      // reader.readAsDataURL(file);
    } catch (err) {}
  };

  return (
    <label
      onDragOver={e => e.preventDefault()}
      onDrop={ev => {
        ev.preventDefault();
        setFile(ev.dataTransfer.files[0].name);
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
        border: "2px dashed grey"
      }}
    >
      <div>
        {file !== null && <p>Uploaded - {file}</p>}
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
        accept=".apex"
      />
    </label>
  );
};
export default function FilePickerScreen({ setCompositions }) {
  useEffect(() => {
    setCompositions(["single_event", "double_event"]);
  }, []);
  return <FilePicker />;
}
