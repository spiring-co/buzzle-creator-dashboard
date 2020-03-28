import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1> HOME</h1>
      <Link to="profile">Your profile</Link>
      <Link to="/videoTemplates">Your Video Templates</Link>
      <Link to="/orders">Your Orders</Link>
    </div>
  );
}
export default Home;
