import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <p> Hi, name here</p>
      <br />
      <Link to="profile">Your Profile</Link>
      <br />
      <Link to="/videoTemplates">Your Video Templates</Link>
      <br />
      <Link to="/orders">Your Orders</Link>
    </div>
  );
}
export default Home;
