import React from "react";

export default (props) => {
  const { textLayers = [], imageLayers = [], pickerLayers = [] } = props;
  // layers coming may comes as array of object ,
  //currently all layers are configured as they are array of strings,
  //except textLayers which is configured as {name:string,value:string}
  const [type, setType] = React.useState(props?.field?.type ?? null);
  const [name, setName] = React.useState(props?.field?.name ?? null);
  const [required, setRequired] = React.useState(
    props?.field?.required ?? null
  );
  const [label, setLabel] = React.useState(props?.field?.label ?? "");
  const [maxLength, setMaxLength] = React.useState(
    props?.field?.maxLength ?? null
  );
  const [options, setOptions] = React.useState(
    props?.field?.options ?? [
      {
        label: "",
        value: "",
      },
    ]
  );
  const [width, setWidth] = React.useState(props?.field?.width ?? 0);
  const [height, setHeight] = React.useState(props?.field?.height ?? 0);

  const inputTypes = [
    { label: "Text", value: "custom_text_input" },
    { label: "Picker", value: "custom_picker" },
    { label: "Image", value: "custom_image_picker" },
  ];

  const toggleDialog = (state) => {
    props.toggleDialog(state);
  };

  const handleFieldSubmit = () => {
    switch (type) {
      case "custom_text_input":
        props.editField
          ? props.editFieldValue({ type, label, required, maxLength, name })
          : props.addField({ type, label, required, maxLength, name });
        break;
      case "custom_picker":
        props.editField
          ? props.editFieldValue({ type, label, required, options, name })
          : props.addField({ type, label, required, options, name });
        break;
      case "custom_image_picker":
        props.editField
          ? props.editFieldValue({ type, label, required, width, height, name })
          : props.addField({ type, label, required, width, height, name });
        break;
      default:
        throw new Error();
    }
    toggleDialog(false);
  };

  const renderTextInputCreator = () => (
    <div>
      <label for="label">Label : </label>
      <input
        value={label}
        type="text"
        onChange={(e) => setLabel(e.target.value)}
      />
      <br />
      <label for="required">Required : </label>
      <select
        value={required}
        id="required"
        onChange={(e) => {
          setRequired(e.target.value);
        }}
      >
        <option value="" disabled selected>
          Select Required
        </option>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
      <br />
      <label for="maxLength">Max length : </label>
      <input
        value={maxLength}
        type="number"
        onChange={(e) => setMaxLength(e.target.value)}
      />
      <br />
    </div>
  );
  const handleOption = (index, value) => {
    setOptions(
      options.map((item, i) => {
        if (i === index) {
          return {
            label: value,
            value: value.toLowerCase().split(" ").join("_"),
          };
        }
        return item;
      })
    );
  };
  const handleOptionDelete = (index) => {
    setOptions(options.filter((item, i) => i !== index));
  };
  const addOption = () => {
    setOptions([...options, { label: "", value: "" }]);
  };
  const renderPickerCreator = () => (
    <div>
      <label for="label">Label : </label>
      <input
        value={label}
        type="text"
        onChange={(e) => setLabel(e.target.value)}
      />
      <br />
      <label for="required">Required : </label>
      <select
        value={required}
        id="required"
        onChange={(e) => {
          setRequired(e.target.value);
        }}
      >
        <option value="" disabled selected>
          Select Required
        </option>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
      <br />
      {options.map((item, index) => {
        return (
          <div key={index}>
            <lable for="label">Option Label</lable>
            <input
              placeholder="Enter Label"
              onChange={(e) => handleOption(index, e.target.value)}
              type="text"
              value={item.label}
            />
            <button
              onClick={() => handleOptionDelete(index)}
              disabled={options.length === 1}
            >
              Delete
            </button>
          </div>
        );
      })}
      <br />
      <button onClick={() => addOption()}>Add option</button>
      <br />
    </div>
  );
  const renderImageCreator = () => (
    <div>
      <label for="label">Label : </label>
      <input
        value={label}
        type="text"
        onChange={(e) => setLabel(e.target.value)}
      />
      <br />
      <label for="required">Required : </label>
      <select
        value={required}
        id="required"
        onChange={(e) => {
          setRequired(e.target.value);
        }}
      >
        <option value="" disabled selected>
          Select Required
        </option>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
      <br />
      <label for="width">Enter Width : </label>
      <input
        id="width"
        value={width}
        type="number"
        onChange={(e) => {
          setWidth(e.target.value);
        }}
      />
      <br />
      <label for="height">Enter Height : </label>
      <input
        id="height"
        value={height}
        type="number"
        onChange={(e) => {
          setHeight(e.target.value);
        }}
      />
    </div>
  );
  const renderInputForm = () => {
    switch (type) {
      case "custom_text_input":
        return renderTextInputCreator();

      case "custom_picker":
        return renderPickerCreator();

      case "custom_image_picker":
        return renderImageCreator();

      default:
        return null;
    }
  };
  const fieldsSelector = () => {
    switch (type) {
      case "custom_text_input":
        return textLayers.map((item, index) => {
          if (props.usedFields.includes(item.name)) {
            return false;
          }
          return (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          );
        });
      case "custom_picker":
        return pickerLayers.map((item, index) => {
          if (props.usedFields.includes(item)) {
            return false;
          }
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        });
      case "custom_image_picker":
        return imageLayers.map((item, index) => {
          if (props.usedFields.includes(item)) {
            return false;
          }
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        });

      default:
        return null;
    }
  };

  return (
    <dialog open style={{ margin: "auto", zIndex: 999 }}>
      <p>Add Field to {props.name} </p>
      <label>Input Type : </label>
      <select onChange={({ target: { value } }) => setType(value)}>
        <option
          value=""
          disabled
          selected={!type}
          children={"Select Input Type"}
        />
        {inputTypes.map((item, index) => (
          <option
            key={index}
            disabled={type === item}
            selected={type === item}
            value={item.value}
            children={item.label}
          />
        ))}
      </select>
      <label>Select Layer : </label>
      <select onChange={({ target: { value } }) => setName(value)}>
        <option
          value=""
          disabled
          selected
          children={!name ? "Select Field" : name}
        />
        {fieldsSelector()}
      </select>
      {renderInputForm(type)}
      <div>
        <button
          onClick={handleFieldSubmit}
          children={props.editField ? "Edit" : "Add Field"}
        />
        <button onClick={() => toggleDialog(false)} children={"Close"} />
      </div>
    </dialog>
  );
};
