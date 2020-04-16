import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function TagsInput({
  onchange,
  onblur,
  values,
  names,
  types,
  placeholders,
  isInvalids,
}) {
  const [tag, setTag] = useState([]);
  const inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      TagsInput.current.val = "";
      if (tag.find((tags) => tags.toLowerCase() === val.toLowerCase())) {
        return;
      }
      setTag([...tag, val]);
    } else if (e.key === "Backspace" && !val) {
      removeTag(tag.length - 1);
    }
  };
  let TagsInput = useRef(0);

  const removeTag = (i) => {
    const newTags = [...tag];
    newTags.splice(i, 1);
    setTag(newTags);
  };

  return (
    <div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
        }}
      >
        {tag.map((t, i) => (
          <li
            key={t}
            style={{
              fontSize: "large",
              fontWeight: "bold",
            }}
          >
            {t}

            <button
              size="sm"
              style={{
                backgroundColor: "blue",
                border: "none",
                borderRadius: "5px",
              }}
              type="button"
              onClick={() => {
                removeTag(i);
              }}
            >
              x
            </button>
          </li>
        ))}
      </ul>

      <Form.Control
        ref={TagsInput}
        onChange={onchange}
        onBlur={onblur}
        value={values}
        name={names}
        type={types}
        placeholder={placeholders}
        isInvalid={isInvalids}
        onKeyDown={inputKeyDown}
      />
    </div>
  );
}

export default TagsInput;
