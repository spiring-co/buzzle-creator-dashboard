import React from "react";
import {
  Navbar,
  Container,
  Dropdown,
  Badge,
  DropdownButton,
} from "react-bootstrap";
import { Link, BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
function Navbars({ auth, log }) {
  const Dropbtn = styled.div`
    background-color: #78e08f;
    color: white;
    padding: 18px;
    border-radius: 50%;
  `;
  const Dropdown = styled.div`
    position: relative;
    left: 3vh;
    top: 1vh;
    display: inline-block;
    float: right;
    margin-right: 5vh;
  `;

  const DropContent = styled.div`
    display: none;

    position: absolute;
    background-color: white;
    min-width: 120px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    ${Dropdown}:hover & {
      display: block;
    }
  `;

  const DropItme = styled.a`
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  `;

  return (
    <Container fluid>
      <Navbar
        sticky="top"
        style={{ backgroundColor: " #dfe4ea", height: "7vh", width: "100%" }}
        sticky="top"
        bg="black"
        variant="light"
      >
        <Navbar.Brand
          style={{
            fontSize: "30px",
            position: "relative",
            left: "3vh",
            top: "1vh",
            fontFamily: "Source",
            fontWeight: "700",
          }}
        >
          {" "}
          <Router>
            <img
              src={require("../assets/logo.png")}
              style={{ height: "2rem", margin: "0px 10px 10px 0px" }}
              alt="Pharaoh Logo"
            />
            <Link to="/home" style={{ color: "black" }}>
              Pharaoh
            </Link>
          </Router>
        </Navbar.Brand>

        {auth ? (
          <button style={{ float: "right", display: "block" }} onClick={log}>
            Logout
          </button>
        ) : null}

        <Dropdown>
          <Dropbtn></Dropbtn>
          <DropContent>
            <DropItme>Link 1</DropItme>
            <DropItme>Link 2</DropItme>
            <DropItme>Link 3</DropItme>
          </DropContent>
        </Dropdown>
      </Navbar>
    </Container>
  );
}

export default Navbars;
