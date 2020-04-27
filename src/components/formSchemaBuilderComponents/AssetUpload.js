import React from "react";

export default function AssetUpload({
  setActiveDisplayIndex,
  activeDisplayIndex,
}) {
  return (
    <div>
      <p>The Asset Uploader</p>
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
