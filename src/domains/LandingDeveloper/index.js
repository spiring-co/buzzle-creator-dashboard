import React from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  makeStyles,
} from "@material-ui/core";
import Login from "common/Login";
import {  Redirect } from "react-router-dom";
import Branding from "common/Branding";
import { useTranslation } from "react-i18next";
import uploadIllustration from "assets/upload.svg";
import downloadIllustration from "assets/download.svg";
import apiIllustration from "assets/api.svg";
import developerIllustration from "assets/developer.svg";
import analyticsIllustration from "assets/analytics.png";
import editIllustration from "assets/edit.jpg";
import timeIllustration from "assets/time.png";
import { useAuth } from "services/auth";
import Fade from 'react-reveal/Fade';

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
    height: "85vh",
    width: "100%",
    flex: 1,
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
    <div>
      <Grid container direction="row" className={classes.viewportHeight} style={{ backgroundColor: "blue" }}>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <img style={{ height: 400, width: 400 }} src={developerIllustration} />
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          {/* <Typography variant="h4" className={classes.logo}>
              <span className={classes.hoverHighlight}>Buzzle!</span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                fontFamily: "Poppins",
                margin:20
              }}
              color="textPrimary"
            >
              Register yourself as a Developer
            </Typography>
            <Button variant="contained" >Join Now</Button> */}
          <Login
            heading="Sign in as a Developer"
            subHeading=""
            role="Developer"
          />
        </Grid>
      </Grid>
      <Grid
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade left>
          <Grid
            item
            style={{
              margin: 20,
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box style={{ display: "flex", flexDirection: "column", marginLeft: "inherit" }}>
              <Typography
                variant="h7"
                style={{
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  fontFamily: "Poppins",
                }}
              >
                STEP 1:
              {<br></br>}
              SELECT YOUR TEMPLATE
            </Typography>
              <br></br>
              <Typography
                variant="h8"
                style={{

                  fontSize: "1 rem",
                  fontFamily: "Poppins",
                }}
              >
                You can upload your templates to buzzle in order to render them
                through our service. You may choose from our collection of
                templates provided by our registered creators.
            </Typography>
            </Box>
          </Grid>
        </Fade>
        <Fade right>
          <Grid
            item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              height: "100%",
            }}
          >
            <img style={{ height: 400, width: 400 }} src={uploadIllustration} />
          </Grid>
        </Fade>
      </Grid>
      <Grid style={{
        display: "flex", flexDirection: "row", justifyContent: "center",
        alignItems: "center",
      }}>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50%",
            height: "100%",
          }}
        >
          <Fade left>
            <img style={{ height: 400, width: 400 }} src={apiIllustration} />
          </Fade>
        </Grid>
        <Grid
          item
          style={{
            margin: 20,
            width: "50%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Fade right>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h7"
                style={{
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  fontFamily: "Poppins",
                }}
              >
                STEP 2:
              {<br></br>}
              IMPLEMENT OUR API/ READ THE DOCS
            </Typography>
              <br></br>
              <Typography
                variant="h8"
                style={{

                  fontSize: "1 rem",
                  fontFamily: "Poppins",
                }}
              >
                You get a personal API key from us in order to get access to our API.
                You may find all the needed information in our API documentation.
             </Typography>
            </Box>
          </Fade>
        </Grid>
      </Grid>
      <Grid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
        }}>
        <Fade left>
          <Grid
            item
            style={{
              margin: 20,
              width: "50%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box style={{ display: "flex", flexDirection: "column", marginLeft: "inherit" }}>
              <Typography
                variant="h7"
                style={{
                  fontWeight: 400,
                  fontSize: "1.5rem",
                  fontFamily: "Poppins",
                }}
              >
                STEP 3:
              {<br></br>}
              DOWNLOAD YOUR VIDEOS
            </Typography>
              <br></br>
              <Typography
                variant="h8"
                style={{
                  fontSize: "1 rem",
                  fontFamily: "Poppins",
                }}
              >
                As a developer, you get priority to our rendering servers by which you get your videos rendered in no time.
                You get an easy access to your videos while having an option to edit any details needed.
             </Typography>
            </Box>
          </Grid>
        </Fade>
        <Fade right>
          <Grid
            item
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50%",
              height: "100%",
            }}
          >
            <img style={{ height: 400, width: 400 }} src={downloadIllustration} />
          </Grid>
        </Fade>
      </Grid>
      <Grid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: 100
        }}>
        <Fade top>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                flexDirection: "column",
                margin: 20,
                height: "100%",
              }}
            >
              <Typography style={{ textAlign: "center", fontWeight: 500, margin: 20, fontFamily: "Poppins", }}>EASY ANALYTICS</Typography>
              <img style={{ height: 80, width: 80 }} src={analyticsIllustration} />
              <br></br>
              <Typography style={{ textAlign: "center" }}>You get personal analytics page to make it easier for you to analyse your jobs.</Typography>
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                flexDirection: "column",
                margin: 20,
                height: "100%",
              }}
            >
              <Typography style={{ textAlign: "center", fontWeight: 500, margin: 20, fontFamily: "Poppins", }}>PRIORITY RENDERING</Typography>
              <img style={{ height: 80, width: 80 }} src={timeIllustration} />
              <br></br>
              <Typography style={{ textAlign: "center" }}>Your videos get priority in rendering and you receive them at an efficient speed.</Typography>
            </Grid>
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                flexDirection: "column",
                margin: 20,
                height: "100%",
              }}
            >
              <Typography style={{ textAlign: "center", fontWeight: 500, margin: 20, fontFamily: "Poppins", }}>DETAIL ORIENTED JOBS</Typography>
              <img style={{ height: 80, width: 80 }} src={editIllustration} />
              <br></br>
              <Typography style={{ textAlign: "center" }}>You may change any details and render your videos again whenever required.</Typography>
            </Grid>
          </Box>
        </Fade>
        <Button variant="contained" onClick={() => window.scroll({ top: 0, left: 0, behavior: 'smooth' })} color="primary" style={{ marginTop: 60 }} >Register Now</Button>
      </Grid>
      <Grid container direction="row" style={{ backgroundColor: "#3e3e3f", height: "35vh" }}>
        <Box style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" style={{
            margin: 16,
            fontWeight: 500,
            fontFamily: "Poppins",
            color: "white"
          }}>
            <span>Buzzle!</span>
          </Typography>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "row", width: "120vh", alignItems: "baseline" }}>
              <Box style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "baseline", width: "33%", marginLeft: "10%"
              }}>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Terms & Conditions</Button>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Privacy Policy</Button>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Cookies Policy</Button>
              </Box>
              <Box style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "baseline", width: "33%", marginLeft: "10%"
              }}>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Blogs</Button>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>About us</Button>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Support</Button>
              </Box>
              <Box style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                alignItems: "baseline", width: "33%", marginLeft: "10%"
              }}>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>Contact Us</Button>
                <Button style={{ color: "white", margin: "5%", fontWeight: 400 }}>FAQs</Button>
              </Box>
            </Box>
            <Button variant="contained" color="primary" style={{ alignSelf: "baseline", marginLeft: "30vh", marginTop: "3vh" }}>Join us as a Creator</Button>
          </Box>
        </Box>
      </Grid>
    </div>
  );
}
export default Landing;
