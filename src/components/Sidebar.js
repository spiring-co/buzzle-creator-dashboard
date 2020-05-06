import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import pen from "../assets/pen-tool.svg";
import cart from "../assets/shopping-cart.svg";
import setting from "../assets/settings.svg";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
function SideBar({ Url, onclick }) {
  return (
    <Nav
      variant="tabs"
      justify
      defaultActiveKey="/home"
      className="flex-column text-center font-weight-bold"
    >
      <Nav.Item>
        <Button
          variant="dark"
          className="float-right mt-2 mb-2"
          onClick={onclick}
        >
          X
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link style={{ color: "black" }} as={Link} to={`${Url}/profile`}>
          <Row>
            <Col md="1">
              <img src={setting} />
            </Col>
            <Col sm="1">Setting</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          style={{ color: "black" }}
          activeClassName="active"
          as={Link}
          to={`${Url}/videoTemplates`}
        >
          <Row>
            <Col sm="1">
              {" "}
              <img src={pen} />
            </Col>
            <Col sm="1">Templates</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          style={{ color: "black" }}
          activeClassName="active"
          as={Link}
          to={`${Url}/orders`}
        >
          <Row>
            <Col sm="1">
              {" "}
              <img src={cart} />
            </Col>
            <Col sm="1"> Orders</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SideBar;
