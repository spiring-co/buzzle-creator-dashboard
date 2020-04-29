import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
function Landing() {
  const { t, i18n } = useTranslation();
  
  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }
  return (
    <div>
      {/* <nav
        style={{ width: "100%", padding: "2rem 0", backgroundColor: "gray" }}
      > 
        <button onClick={() => handleClick('en')}>English</button>

      </nav> */}
      <Container className="mt-5">
        <h1 className="display-4">Pharaoh</h1>
        <p className="text-muted">
        {t('welcome')}{" "}
        </p>
        <Button className="m-1" as={Link} to="/login">
          Login
        </Button>
        <Button variant="secondary" as={Link} className="m-1" to="/register">
          Register
        </Button>
      </Container>
    </div>
  );
}
export default Landing;
