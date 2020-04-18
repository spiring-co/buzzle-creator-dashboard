import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
function TagsInput({
  onchange,
  onblur,
  values,
  names,
  types,
  placeholders,
  isInvalids,
}) {
  const [items, setItems] = useState([]);

  const [input, setInput] = useState("");
  const styles = {
    container: {
      border: "1px solid #ddd",
      padding: "5px",
      borderRadius: "5px",
    },

    items: {
      display: "inline-block",
      padding: "2px",
      border: "1px solid blue",
      fontFamily: "Helvetica, sans-serif",
      borderRadius: "5px",
      marginRight: "5px",
      cursor: "pointer",
    },

    input: {
      outline: "none",
      border: "none",
      fontSize: "14px",
      fontFamily: "Helvetica, sans-serif",
    },
  };

  const handleInputChange = (evt) => {
    setInput(evt.target.value);
  };

  const handleInputKeyDown = (evt) => {
    if (evt.keyCode === 13) {
      const { value } = evt.target;

      setItems([...items, value]);
      setInput("");
    }

    if (items.length && evt.keyCode === 8 && !input.length) {
      setItems(items.slice(0, items.length - 1));
    }
  };

  const handleRemoveItem = (index) => {
    return () => {
      setItems(items.filter((item, i) => i !== index));
    };
  };

  return (
    <div>
      <ul style={styles.container}>
        {items.map((item, i) => (
          <li key={i} style={styles.items} onClick={handleRemoveItem(i)}>
            {item}
            <span>(x)</span>
          </li>
        ))}
        <input
          onChange={onchange}
          onBlur={onblur}
          value={values}
          name={names}
          type={types}
          placeholder={placeholders}
          isInvalid={isInvalids}
          style={styles.input}
          //value={input}
          //onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </ul>
    </div>
  );
}

export default TagsInput;
