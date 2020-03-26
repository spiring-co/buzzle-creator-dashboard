import React, { useState } from "react";
import FilePickerScreen from "./pages/FilePickerScreen";
import FormBuilderScreen from "./pages/FormBuilderScreen";
// FilePickerScreen and FormSchemaBuilder
//Just to Show working, will be removed when work with the flow

function App() {
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const requestClose = () => {
    setIsFilePickerVisible(false);
    setIsFormVisible(false);
  };
  if (isFilePickerVisible) {
    return (
      <div>
        <button onClick={requestClose}>Close Me</button>
        <FilePickerScreen />
      </div>
    );
  } else if (isFormVisible) {
    return (
      <div>
        <button onClick={requestClose}>Close Me</button>
        <FormBuilderScreen />
      </div>
    );
  }
  return (
    <div className="App">
      <h1>Pharaoh 🐈</h1>
      <button onClick={() => setIsFilePickerVisible(true)}>
        Upload Your File
      </button>
      <button onClick={() => setIsFormVisible(true)}>Create Your Form</button>
    </div>
  );
}

export default App;
