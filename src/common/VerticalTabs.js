import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useAuth } from "services/auth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tabs: {
    borderLeft: `1px solid ${theme.palette.divider}`,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs({ tabs }) {
  const classes = useStyles();
  const {
    user: { role },
  } = useAuth();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        centered={false}
        variant="scrollable"
        TabIndicatorProps={{ style: { left: 0 } }}
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}>
        {tabs
          .filter(({ allowedRoles }) => allowedRoles.includes(role))
          ?.map(({ label }, index) => (
            <Tab
              style={{ borderBottom: "1px solid lightgrey" }}
              label={label}
              {...a11yProps(index)}
            />
          ))}
      </Tabs>
      {tabs
        .filter(({ allowedRoles }) => allowedRoles.includes(role))
        ?.map(({ component, allowedRoles = [] }, index) => (
          <TabPanel value={value} index={index} style={{ width: "100%", minHeight: 300 }}>
            {component}
          </TabPanel>
        ))}
    </div>
  );
}
