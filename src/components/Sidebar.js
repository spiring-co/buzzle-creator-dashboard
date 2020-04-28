import React from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { Link, useRouteMatch } from "react-router-dom";

export default () => {
  let { path } = useRouteMatch();

  return (
    <Nav justify activeKey={`${path}/`} className="flex-column ">
      <Nav.Item>
        <Nav.Link as={Link} to={`${path}/`}>
          <Row>
            <Col md="1">
              <i class="material-icons">home</i>
            </Col>
            <Col sm="1">Home</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={`${path}/profile`}>
          <Row>
            <Col md="1">
              <i class="material-icons">settings</i>
            </Col>
            <Col sm="1">Setting</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={`${path}/videoTemplates`}>
          <Row>
            <Col sm="1">
              <i class="material-icons">color_lens</i>
            </Col>
            <Col sm="1">Templates</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={`${path}/orders`}>
          <Row>
            <Col sm="1">
              <i class="material-icons">receipt</i>
            </Col>
            <Col sm="1"> Orders</Col>
          </Row>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
