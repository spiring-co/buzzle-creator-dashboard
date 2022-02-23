import React from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  makeStyles,
  Container,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import Branding from "common/Branding";
import { useTranslation } from "react-i18next";
import landingIllustration from "assets/landing.svg";
import otherIllustration from "assets/404.svg";
import videoIllustration from "assets/video.svg";
import { useAuth } from "services/auth";

const useStyles = makeStyles({
  hoverHighlight: {
    backgroundImage:
      "linear-gradient(transparent calc(15% - 5px), #394afa 5px)",
    backgroundSize: 0,
    backgroundRepeat: "no-repeat",
    display: "inline",
    transition: "0.5s ease",
    "-webkit-transition": "0.5s ease",

    "&:hover": {
      color: "white",
      backgroundSize: "100%",
    },
  },
  hoverUnderline: {
    backgroundImage:
      "linear-gradient(transparent calc(100% - 5px), #394afa 5px)",
    backgroundSize: 0,
    backgroundRepeat: "no-repeat",
    display: "inline",
    transition: "0.5s ease",
    "-webkit-transition": "0.5s ease",

    "&:hover": {
      backgroundSize: "100%",
    },
  },
  logo: {
    marginBottom: 16,
    fontWeight: 800,
    fontFamily: "Poppins",
  },
  heightInherit: {
    height: "inherit",
  },
  viewportHeight: {
    height: "90vh",
  },
  background: {
    height: "100%",
    width: "200%",
    position: "absolute",
    top: 0,
    left: "-50%",
    zIndex: -999,
  },
  whiteText: {
    color: "white",
  },
  whiteBg: {
    backgroundColor: "white",
  },
});

function Landing() {
  const { user } = useAuth();

  const { t } = useTranslation();
  const classes = useStyles();
  if (user) return <Redirect to="/home" />;

  return (
    <Container className={classes.heightInherit} maxWidth="md">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.viewportHeight}>
        <Grid md={6} sm={6} item style={{ flex: 1, padding: "5%" }}>
          <img src={landingIllustration} />
        </Grid>
        <Grid md={6} sm={6} item>
          <Box mb={4} p={4}>
            <Typography variant="h1" className={classes.logo}>
              <span className={classes.hoverHighlight}>Buzzle!</span>
            </Typography>
            <Box mt={2}>
              <Typography>
                <span className={classes.hoverUnderline}>{t("welcome")}🥳</span>
              </Typography>
            </Box>
            <Box mt={6}>
              <Box display="inline-block" m={1}>
                <Button
                  component={Link}
                  to="/login"
                  color="primary"
                  variant="contained">
                  Get Started
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ position: "relative" }}>
        <Box bgcolor="primary.main" className={classes.background} />
        <Grid md={6} sm={6} item>
          <Box mb={4} p={4}>
            <Box mt={2}>
              <Typography className={classes.whiteText}>
                <span className={classes.hoverUnderline}>{t("welcome")}</span>
              </Typography>
            </Box>
            <Box mt={6}>
              <Box display="inline-block" m={1}>
                <Button
                  component={Link}
                  to="/login"
                  className={classes.whiteBg}
                  variant="contained">
                  Get Started
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid md={6} sm={6} item style={{ flex: 1, padding: "5%" }}>
          <img src={otherIllustration} />
        </Grid>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid md={6} sm={6} item style={{ flex: 1, padding: "5%" }}>
          <img src={videoIllustration} />
        </Grid>
        <Grid md={6} sm={6} item>
          <Box mb={4} p={4}>
            <Box mt={2}>
              <Typography>
                <span className={classes.hoverUnderline}>{t("welcome")}🥳</span>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Branding />
    </Container>
  );
}
export default Landing;
