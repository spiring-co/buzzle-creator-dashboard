import React, { useState } from "react";

export default () => {
  const [image, setImage] = useState("");
  return (
    <div>
      <form>
        <label>username</label>
        <input type="text" />
        <label>Profile Image</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (function (theFile) {
              return function (e) {
                setImage(e.target.result);
              };
            })(file);
            reader.readAsDataURL(file);
          }}
        />
        <img alt="avatar" src={image} />
        <label>email</label>
        <input type="text" />
        <label>Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="123-45-678"
          pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
          required
        ></input>
        <label>birth Date</label>
        <input type="date" />
        <input type="submit" />
      </form>
    </div>
  );
};
