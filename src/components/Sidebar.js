import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";
function SideBar({ Url }) {
  return (
    <Nav variant="tabs" defaultActiveKey="/home" className="flex-column">
      <Nav.Item>
        <Nav.Link className="text-dark" as={NavLink} to={`${Url}/profile`}>
          Your Profile and Settings
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to={`${Url}/videoTemplates`}>
          Your Video Templates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2">
          <NavLink
            style={{ textDecoration: "none", color: "black" }}
            to={`${Url}/orders`}
          >
            Your Orders
          </NavLink>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SideBar;
