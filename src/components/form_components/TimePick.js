import "react-datepicker/dist/react-datepicker.css";

import React, { useState } from "react";

import styled from "styled-components";

const StyledInput = styled.input`
  height: 55px;
  width: 100%;
  outline: 0px;
  display: block;
  background: transparent;
  font-size: 20px;
  font-family: poppins;
  font-weight: 700;
  color: #212121;
  border: none;
  margin-bottom: 50px;
  border-bottom: 2px solid #e3e3e3;
`;
const TimePick = ({ label, name, value, onChange, required }) => {
  const [time, setTime] = useState(value);
  React.useEffect(() => {
    onChange(label, name, value !== null ? value : " ", required);
  }, []);

  return (
    <div>
      <label style={styles.label} htmlFor="time">
        {label}
      </label>
      <StyledInput
        id="time"
        type="time"
        value={time}
        onChange={(e) => {
          var result = e.target.value;
          setTime(result);
          onChange(label, name, result, required);
        }}
        style={{ marginLeft: "10px" }}
        placeholder={label}
      />
    </div>
  );
};

const styles = {
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 18,
    fontFamily: "Poppins",
    fontWeight: 600,
  },
};

export default TimePick;
