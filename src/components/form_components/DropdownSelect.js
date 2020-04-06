import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Picker = styled.select`
  height: 55px;
  width: 100%;
  outline: 0px;
  background: transparent;
  font-size: 20px;
  font-family: poppins;
  font-weight: 700;
  color: rgb(33, 33, 33);
  border: none;
  margin-bottom: 50px;
  border-bottom: 2px solid #e3e3e3;
  &:after {
    content: "▼";
  }
  &:focus {
    background: aliceblue;
  }
`;
export default ({ name, label, value, required, onChange, options }) => {
  const [dValue, setDValue] = useState(value);
  useEffect(() => {
    onChange(label, name, value !== null ? value : " ", required);
  }, []);

  return (
    <Picker
      onFocus={console.log}
      onChange={(e) => onChange(label, name, e.target.value, required)}
    >
      <option
        style={{ color: "#e3e3e3" }}
        disabled
        selected={dValue !== null ? false : true}
        value=""
      >
        {label}
      </option>
      {options.map(({ label, value }) => (
        <option
          selected={dValue !== value ? false : true}
          value={value}
          key={value}
        >
          {label}
        </option>
      ))}
    </Picker>
  );
};
