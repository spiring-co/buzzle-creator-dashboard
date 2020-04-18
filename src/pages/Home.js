import Dashboard from "pages/Dashboard";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
<<<<<<< HEAD
=======
import { useSpring, animated } from "react-spring";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a

import Col from "react-bootstrap/Col";
import Sidebar from "../components/Sidebar";

import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

export default () => {
  let { path, url } = useRouteMatch();
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  const handleClick = () => {
    setSidebarStatus(true);
  };
  const handleCloseSidebar = () => setSidebarStatus(false);
  return (
    <Container fluid>
      <Row>
<<<<<<< HEAD
        <Col md="2">
          <Sidebar Url={url} />
=======
        <Col md={sidebarStatus ? 2 : null}>
          {sidebarStatus && <SideBar onclick={handleCloseSidebar} Url={url} />}
>>>>>>> fdcd2e971e476652ee721a6a4efa6c9d3f0fc98a
        </Col>

        <Col className="bg-light" md={sidebarStatus ? 10 : 12}>
          <Row>
            <Col>
              <Button onClick={handleClick}>
                <i class="material-icons">menu</i>
              </Button>
            </Col>
            <Col sm="11">
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
        </Col>
      </Row>
    </Container>
  );
};
