import React from "react";
import { Button, Container, Typography } from '@material-ui/core'
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
      <Container style={{ margin: 50 }}>
        <Typography variant="h3">Pharaoh</Typography>
        <p style={{ marginTop: 5 }}>
          {t('welcome')}{" "}
        </p>
        <Button
          style={{ margin: 10 }}
          color={'primary'}
          variant="contained"
        >
          <Link style={{
            textDecoration: 'none',
            color: 'white',
          }} to={"/login"}>Login</Link>
        </Button>
        <Button
          color={'primary'}
          variant="outlined"  >
          <Link style={{
            textDecoration: 'none',
            color: '#3f51b5',
          }} to="/register">Register</Link>
        </Button>
      </Container>
    </div>
  );
}
export default Landing;
