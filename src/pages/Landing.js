import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <Container className="mt-5">
      <h1 className="display-4">Pharaoh</h1>
      <p className="text-muted">
        Welcome to pharaoh, the place to automate your templates with ease.{" "}
      </p>
      <Button className="m-1" as={Link} to="/login">
        Login
      </Button>
      <Button variant="secondary" as={Link} className="m-1" to="/register">
        Register
      </Button>
    </Container>
  );
}
export default Landing;
