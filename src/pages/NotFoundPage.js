import React from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  withStyles,
  makeStyles,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Branding from "components/Branding";
import { useTranslation } from "react-i18next";
import notFoundIllustration from "assets/404.svg";
import { ArrowBack } from "@material-ui/icons";
const HoverHeading = withStyles();
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
  backButton: { marginTop: 10 },
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
});

function NotFoundPage() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  return (
    <Box>
      <Branding />
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
          height: "30vh",
          width: "100vw",
          zIndex: -999,
          position: "absolute",
          left: 0,
          bottom: 0,
          background: "#394afa",
        }}
      />
      <Box>
        <Grid
          style={{ alignItems: "stretch", height: "-webkit-fill-available" }}
          container
          direction="row">
          <Grid
            md={6}
            sm={12}
            item
            style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: "100%" }} src={notFoundIllustration} />
          </Grid>
          <Grid
            md={6}
            sm={12}
            item
            style={{ display: "flex", alignItems: "center" }}>
            <Box mb={4}>
              <Typography
                color=""
                variant="h1"
                style={{
                  color: "#2f3542",
                  marginBottom: 16,
                  fontWeight: 800,
                  fontFamily: "Poppins",
                }}>
                <span className={classes.hoverHighlight}>404</span>
              </Typography>
              <Box mt={2}>
                <Typography
                  variant={"h6"}
                  style={{ fontWeight: 700, width: 350, color: "#2f3542" }}>
                  <span className={classes.hoverUnderline}>
                    {t("notFound")}
                  </span>
                </Typography>
              </Box>
              <Box>
                <Button
                  className={classes.backButton}
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBack />}
                  onClick={() => history.goBack()}
                  children="Go Back"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
export default NotFoundPage;
