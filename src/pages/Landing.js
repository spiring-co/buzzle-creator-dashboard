import React from "react";
import { Button, Container, Typography, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Landing() {
  const { t } = useTranslation();
  return (
    <Box mt={4}>
      <Container maxWidth={"sm"}>
        <Typography variant="h3">Pharaoh</Typography>
        <Typography>{t("welcome")} </Typography>
        <Box display="inline-block" m={1}>
          <Button
            component={Link}
            to="/login"
            color="primary"
            variant="contained"
          >
            Login
          </Button>
        </Box>
        <Box display="inline-block" m={1}>
          <Button
            component={Link}
            to="/register"
            color="primary"
            variant="outlined"
          >
            Register
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
export default Landing;
