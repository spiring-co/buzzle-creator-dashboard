import React from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  withStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import landingIllustration from "assets/landing.svg";
import spiring from "assets/spiring.svg";
const WhiteTypography = withStyles({
  root: {
    color: "#FFFFFF",
  },
})(Typography);
function Landing() {
  const { t } = useTranslation();
  return (
    <Container>
      <Box
        style={{
          height: "100vh",
          width: "100vw",
          zIndex: -9999,
          position: "absolute",
          left: 0,
          top: 0,
          background: "#ffffff",
        }}
      />
      <Box
        style={{
          height: "42vh",
          width: "100vw",
          zIndex: -999,
          position: "absolute",
          left: 0,
          bottom: 0,
          background: "#394afa",
        }}
      />
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          margin: "auto",
        }}>
        <img style={{ height: 32 }} src={spiring} />
        <Typography style={{ color: "white", fontSize: 10 }}>
          Copyright © 2020 All rights reserved | Pharaoh is a product of spiring
          designs pvt. ltd.
        </Typography>
      </div>
      <Box mt={8}>
        <Grid container direction="row">
          <Grid xs={6} item>
            <img src={landingIllustration} />
          </Grid>
          <Grid xs={6} item>
            <Box mt={16}>
              <Typography color="" variant="h3">
                Buzzle!
              </Typography>
              <Box mt={2}>
                <Typography style={{ fontWeight: 700, width: 350 }}>
                  {t("welcome")}🥳{" "}
                </Typography>
              </Box>
              <Box mt={6}>
                <Box display="inline-block" m={1}>
                  <Button
                    component={Link}
                    to="/login"
                    style={{ background: "white" }}
                    variant="contained">
                    Login
                  </Button>
                </Box>
                <Box display="inline-block" m={1}>
                  <Button component={Link} to="/register" variant="outlined">
                    Register
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
export default Landing;
