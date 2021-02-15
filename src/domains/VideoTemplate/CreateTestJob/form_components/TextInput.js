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
  border-bottom: 2px solid #e3e3e3;
`;

const TextInput = ({
  onChange,
  value,
  placeholder,
  maxLength,
  readOnly,
  onBlur,
  touched,
}) => {
  const [charsLeft, setCharsLeft] = useState(maxLength);

  const handleChangeInput = (e) => {
    var input = e.target.value;
    onChange(e);
    setCharsLeft(maxLength - input.length);
  };
  return (
    <div>
      <Input
        onChange={handleChangeInput}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        onBlur={onBlur}
        touched={touched}
      />
      <p>{maxLength - charsLeft + " / " + maxLength}</p>
    </div>
  );
};

export default TextInput;
