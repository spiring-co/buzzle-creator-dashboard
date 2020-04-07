import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

const StyledDatePicker = styled(DatePicker)`
  height: 55px;
  width: 100%;
  display: block;
  outline: 0px;

  font-size: 20px;
  font-family: poppins;
  font-weight: 700;
  border: none;
  margin-bottom: 50px;
  border-bottom: 2px solid #e3e3e3;
`;

const DatePick = ({ label, value, required, name, onChange }) => {
  const [startDate, setStartDate] = useState(
    value !== null ? value : new Date()
  );
  useEffect(() => {
    onChange(label, name, value !== null ? value : " ", required);
  }, []);

  return (
    <StyledDatePicker
      selected={startDate}
      value={startDate}
      onChange={(date) => {
        setStartDate(date);
        onChange(label, name, date, required);
      }}
      placeholderText={label}
      dateFormat="yyyy/MM/dd"
    />
  );
};
export default DatePick;
