import React from "react";
import { Navbar } from "react-bootstrap";
import styled from "styled-components";

export default ({ auth, log }) => {
  const Dropdown = styled.div`
    position: relative;
    float: right;
    margin-right: 3vh;
    margin-top: 1vh;
    background-color: #78e08f;
    color: white;
    padding: 18px;
    border-radius: 50%;
  `;

  const DropdownContent = styled.div`
    display: none;

    position: absolute;
    background-color: white;
    min-width: 120px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    top: 5vh;
    right: 0vh;
    ${Dropdown}:hover & {
      display: block;
    }
  `;

  const DropdownItem = styled.a`
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
  `;

  return (
    <Navbar fixed="top" bg="dark" variant="light">
      <Navbar.Brand href="/home">
        <img
          src={require("../assets/logo.png")}
          style={{ height: "2rem", margin: "0.5rem" }}
          alt="Pharaoh Logo"
        />
        Pharaoh
      </Navbar.Brand>

      {auth ? (
        <button style={{ float: "right", display: "block" }} onClick={log}>
          Logout
        </button>
      ) : null}

      <Dropdown>
        <DropdownContent>
          <DropdownItem>Link 1</DropdownItem>
          <DropdownItem>Link 2</DropdownItem>
          <DropdownItem>Link 3</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </Navbar>
  );
};
