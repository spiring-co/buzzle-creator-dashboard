import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";

export default ({ isAuthenticated, logout }) => {
  return (
    <Navbar bg="light" className="justify-content-between shadow-sm mb-5">
      <Navbar.Brand href="/" className="m-auto">
        <LogoImage src={require("../assets/logo.png")} alt="Pharaoh Logo" />
      </Navbar.Brand>
      <Nav>
        {isAuthenticated && (
          <Dropdown drop="left" id="nav-dropdown">
            <Dropdown.Toggle as={CustomToggle} />
            <Dropdown.Menu>
              <Dropdown.Header>Harsh Bhatia</Dropdown.Header>
              <Dropdown.Item as="button" onClick={logout}>
                Logout
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Privacy Policy</Dropdown.Item>
              <Dropdown.Item>Help</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Nav>
    </Navbar>
  );
};

const StyledDropdown = styled.div`
  background-color: #78e08f;
  color: white;
  height: 5vh;
  width: 5vh;
  border-radius: 50%;
`;

const LogoImage = styled.img`
  height: 1.5rem;
  margin-right: 0.5rem;
`;
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <StyledDropdown
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    children={children}
  />
));
