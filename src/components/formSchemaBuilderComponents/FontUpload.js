import React from "react";

export default function FontUpload({
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  return (
    <div>
      <p>The Font Uploader</p>
      <button
        children={"back"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex - 1)}
      />
      <button
        children={"Next"}
        onClick={() => setActiveDisplayIndex(activeDisplayIndex + 1)}
      />
    </div>
  );
}
