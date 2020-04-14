import React, { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  height: 55px;
  width: 100%;
  outline: 0px;
  background: transparent;
  font-size: 20px;
  font-family: poppins;
  font-weight: 700;
  color: #212121;
  border: none;
  margin-bottom: 50px;
  border-bottom: 2px solid #e3e3e3;
`;

const TextInput = ({ name, label, value, required, onChange }) => {
  const [text, setText] = useState(value);
  React.useEffect(() => {
    onChange(label, name, value !== null ? value : " ", required);
  }, []);
  return (
    <Input
      value={text}
      type="text"
      name={name}
      onChange={(e) => {
        setText(e.target.value);
        onChange(label, name, e.target.value, required);
      }}
      required={required}
      autoComplete="off"
      placeholder={label}
    />
  );
};

export default TextInput;
