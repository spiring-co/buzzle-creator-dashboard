import { Section } from "components/Layout";
import React from "react";

import DatePick from "./DatePick";
import DropdownSelect from "./DropdownSelect";
import ImagePick from "./ImagePick";
import MusicPick from "./MusicPick";
import TextInput from "./TextInput";
import TimePick from "./TimePick";

export default function renderField(f, handleChange, order) {
  console.log(f);
  switch (f.type) {
    case "custom_text_input":
      return (
        <TextInput
          value={order?.form_data?.data[f.name] ?? null}
          name={f.name}
          label={f.label}
          onChange={handleChange}
          required={f.required}
        />
      );

    case "custom_picker":
      return (
        <DropdownSelect
          value={order?.form_data?.data[f.name] ?? null}
          name={f.name}
          label={f.label}
          required={f.required}
          options={f.options}
          onChange={handleChange}
        />
      );

    case "custom_date_picker":
      return (
        <DatePick
          value={order?.form_data?.data[f.name] ?? null}
          name={f.name}
          label={f.label}
          required={f.required}
          onChange={handleChange}
        />
      );

    case "custom_time_picker":
      return (
        <TimePick
          value={order?.form_data?.data[f.name] ?? null}
          required={f.required}
          name={f.name}
          label={f.label}
          onChange={handleChange}
        />
      );

    case "custom_image_picker":
      return (
        <ImagePick
          value={order?.form_data?.data[f.name] ?? null}
          required={f.required}
          name={f.name}
          size={{ height: f.height, width: f.width }}
          label={f.label}
          onChange={handleChange}
        />
      );

    case "custom_music_picker":
      return (
        <MusicPick
          value={order?.form_data?.data[f.name] ?? null}
          name={f.name}
          label={f.label}
          required={f.required}
          defaultValue={f.defaultValue}
          onChange={handleChange}
        />
      );

    default:
      return <p> field here.</p>;
  }
}

// const Text = styled.div`
//   padding: 5px;

//   border-radius: 3px;
//   margin-bottom: 10px;
//   width: 100%;
//   box-sizing: border-box;
//   font-family: Poppins;
//   color: #2c3e50;
//   font-size: 14px;
//   -webkit-appearance: none;
// `;

// const Drop = styled.div`
//   padding: 15px;

//   border-radius: 3px;
//   margin-bottom: 10px;
//   width: 100%;
//   box-sizing: border-box;
//   font-family: Poppins;
//   color: #2c3e50;
//   font-size: 14px;
//   -webkit-appearance: none;
// `;

// const Date = styled.div`
//   padding: 15px;

//   border-radius: 3px;
//   margin-bottom: 10px;
//   width: 100%;
//   box-sizing: border-box;
//   font-family: Poppins;
//   color: #2c3e50;
//   font-size: 14px;
//   -webkit-appearance: none;
// `;

// const Button = styled.div`
//   width: 100px;

//   box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.11), 0 1.5px 6px rgba(0, 0, 0, 0.12);
//   -webkit-appearance: none;
//   background: #2ed573;
//   font-family: Poppins, Helvetica, sans-serif;
//   color: white;
//   border: 0 none;
//   border-radius: 3px;
//   cursor: pointer;
//   padding: 10px 5px;
//   margin: 10px 5px;

//   font-size: medium;
//   font-weight: 600;
//   text-transform: uppercase;
// `;

// const Para = styled.p`
//   font-size: 19px;
//   text-transform: uppercase;
//   color: #2c3e50;
//   margin-bottom: 10px;
// `;
