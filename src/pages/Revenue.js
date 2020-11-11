import React, { useEffect } from "react";

export default () => {
  useEffect(() => {
    document.title = "Revenue";
  }, []);

  return (
    <div>
      <p>Coming soon.</p>
    </div>
  );
};
