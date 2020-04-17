import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Col from "react-bootstrap/Col";
import Sidebar from "../components/Sidebar";

import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

export default () => {
  let { path, url } = useRouteMatch();

  return (
    <Container fluid>
      <Row>
        <Col md="2">
          <Sidebar Url={url} />
        </Col>
        <Col className="bg-light" md="10">
          <Switch>
            <div style={{ flex: 3 }}>
              <Route path={`${path}/`} exact component={Dashboard} />
              <Route path={`${path}/profile`} component={Profile} />
              <Route
                path={`${path}/videoTemplates`}
                component={VideoTemplates}
              />
              <Route path={`${path}/orders`} component={Orders} />
            </div>
          </Switch>
        </Col>
      </Row>
    </Container>
  );
};
