import React from "react";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <h1> Hello creator! 👨🏻‍🎨</h1>
      <Link to={{ pathname: "/Profile" }}>
        <button>Edit your Profile</button>
      </Link>
    </div>
  );
}
export default Home;
