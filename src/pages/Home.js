import Dashboard from "pages/Dashboard";
import menu from "../assets/menu.svg";
import Orders from "pages/Orders";
import Profile from "pages/Profile";
import VideoTemplates from "pages/VideoTemplates";
import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { useSpring, animated } from "react-spring";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";

import SideBar from "../components/Sidebar";

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
        <Col md={sidebarStatus ? 2 : null}>
          {sidebarStatus && <SideBar onclick={handleCloseSidebar} Url={url} />}
        </Col>

        <Col className="bg-light" md={sidebarStatus ? 10 : 12}>
          <Row>
            <Col>
              <a onClick={handleClick}>
                <img src={menu} />
              </a>
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
