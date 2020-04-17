import React from "react";
import Nav from "react-bootstrap/Nav";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
function SideBar({ Url }) {
  return (
    <Nav defaultActiveKey="/home" className="flex-column">
      <Nav.Item>
        <Nav.Link activeClassName="active" as={Link} to={`${Url}/profile`}>
          Your Profile and Settings
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          activeClassName="active"
          as={Link}
          to={`${Url}/videoTemplates`}
        >
          Your Video Templates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link activeClassName="active" as={Link} to={`${Url}/orders`}>
          Your Orders
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SideBar;
