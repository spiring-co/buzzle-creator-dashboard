import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useAuth } from "services/auth";
import { AppBar, Paper } from "@material-ui/core";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ height: "100%", width: '100%' }}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index ? (
        <Box style={{ height: "100%", width: '100%' }} >
          {children}
        </Box>
      ) : <div />}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  // root: {
  //   // flexGrow: 1,
  //   backgroundColor: theme.palette.background.paper,
  //   display: "flex",
  //   borderBottom: `1px solid ${theme.palette.divider}`,
  //   borderRight: `1px solid ${theme.palette.divider}`,
  // },
  // tabs: {
  //   borderLeft: `1px solid ${theme.palette.divider}`,
  //   borderRight: `1px solid ${theme.palette.divider}`,
  // },
}));
type IProp = {
  tabs: Array<{
    label: string,
    key: string,
    component: JSX.Element,
    allowedRoles: Array<string>
  }>,
  initialTabIndex?: number
  onTabIndexChange?: (index: number) => void
}
export default function VerticalTabs({ tabs, initialTabIndex = 0, onTabIndexChange }: IProp) {
  const classes = useStyles();
  const { user } = useAuth();
  const [value, setValue] = React.useState(initialTabIndex);
  useEffect(() => {
    if (initialTabIndex !== value) {
      handleChange(null, initialTabIndex)
    }
  }, [initialTabIndex])
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    onTabIndexChange && onTabIndexChange(newValue)
  };

  return (
    <Paper>
      {/* <AppBar position="static" color="default"> */}
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs
          .filter(({ allowedRoles }) => allowedRoles.includes(user?.role))
          ?.map(({ label }, index) => (
            <Tab
              label={label}
              {...a11yProps(index)}
            />
          ))}
      </Tabs>
      {/* </AppBar> */}
      {tabs
        .filter(({ allowedRoles }) => allowedRoles.includes(user?.role))
        ?.map(({ component, allowedRoles = [] }, index) => (
          <TabPanel value={value} index={index}>
            {component}
          </TabPanel>
        ))}
    </Paper>
  );
}
