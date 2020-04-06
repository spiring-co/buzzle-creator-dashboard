import React from "react";
import { NavLink, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
function SideBar({ Url }) {
  const Sidenav = styled.div`
    height: 100%;
    width: 160px;
    position: fixed;

    left: 0;
    background-color: #dfe4ea;
    overflow-x: hidden;
    padding-top: 25px;
  `;

  const SideContent = styled.p`
    text-decoration: none;
    padding: 6px 8px 6px 8px;
    font-size: 20px;
    font-family: Source;
    font-weight: 700;
    color: black;
    display: block;
    &:hover {
      color: white;
      background-color: #74b9ff;
    }
  `;

  return (
    <Sidenav>
      <NavLink to={`${Url}/profile`}>
        <SideContent>Your Profile and Settings</SideContent>
      </NavLink>
      <NavLink to={`${Url}/videoTemplates`}>
        <SideContent>Your Video Templates</SideContent>
      </NavLink>
      <NavLink to={`${Url}/orders`}>
        <SideContent>Your Orders</SideContent>
      </NavLink>
    </Sidenav>
  );
}

export default SideBar;
