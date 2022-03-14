import { Chip, Hidden, Menu, MenuItem } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import BrightnessHigh from "@material-ui/icons/BrightnessHigh";
import BrightnessLow from "@material-ui/icons/BrightnessLow";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import Notifications from "@material-ui/icons/Notifications";
import clsx from "clsx";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { useDarkMode } from "helpers/useDarkMode";
import { useSnackbar } from "notistack";
import React, { forwardRef, MouseEventHandler, useMemo, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useReAuthFlow } from "services/Re-AuthContext";
import { useAuth } from "../services/auth";
import RoleBasedView from "./RoleBasedView";
import { useCurrency } from "services/currencyContext";

const drawerWidth = 240;

function ListItemLink(props: {
  to: string,
  primary: string,
  icon: JSX.Element,
}) {
  const { icon, primary, to } = props;
  const renderLink = useMemo(
    () =>
      forwardRef((itemProps, ref: any) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem
        style={{ height: 48 }}
        button
        component={renderLink}>
        {icon ? <ListItemIcon style={{ marginLeft: 5 }}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: "flex",
    flexgrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },

  menuButton: {
    // marginRight: 36,
    marginRight: theme.spacing(2),

  },
  hide: {
    display: "none",
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menu: {

  },
  grow: {
    flexGrow: 1
  }
})
);


type IProps = {
  items: Array<{
    text: string,
    icon: JSX.Element,
    to: string,
    allowedRoles: Array<'user' | "admin">
  }>,
  window?: () => Window;
}
export default function NavBar({ items, window }: IProps) {
  const classes = useStyles();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar()
  const { reAuthInit } = useReAuthFlow()
  const theme = useTheme();
  const { getConvertedCurrency } = useCurrency()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { signOut } = useAuth();
  const history = useHistory();
  const [t, toggleTheme, componentMounted] = useDarkMode();
  const handleDrawerToggle = () => setDrawerOpen(v => !v)
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const drawer = (<><div className={classes.toolbar}>
    <Box flex={1}>
      <Typography
        noWrap
        component={RouterLink}
        to="/home"
        variant="h5"
        color="textPrimary"
        style={{
          paddingLeft: 20,
          textDecoration: "none",
          fontWeight: 800,
          fontFamily: "Poppins",
        }}>
        Buzzle!
      </Typography>
    </Box>
    <IconButton onClick={handleDrawerClose}>
      {theme.direction === "rtl" ? (
        <ChevronRightIcon />
      ) : (
        <ChevronLeftIcon />
      )}
    </IconButton>
  </div>
    <Divider />
    <List>
      {items.map((item, index) => (
        <RoleBasedView key={item.text} allowedRoles={item?.allowedRoles ?? []}>
          <ListItemLink
            key={item.text + item.icon}
            to={item.to}
            primary={drawerOpen ? item.text : ""}
            icon={item.icon}
          />
        </RoleBasedView>
      ))}
    </List></>)

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen,
            })}>
            <MenuIcon />
          </IconButton>
          {drawerOpen ? (
            <div></div>
          ) : (
            <Typography
              color="inherit"
              component={RouterLink}
              to="/home"
              noWrap
              variant="h5"
              style={{
                textDecoration: "none",
                fontWeight: 800,
                fontFamily: "Poppins",
              }}>
              Buzzle!
            </Typography>
          )}
          <div className={classes.grow} />
          <div className={classes.menu}>
            <Chip
              style={{ marginRight: 10 }}
              avatar={<AccountBalanceWalletIcon />}
              label={`${getConvertedCurrency(parseFloat(`${user?.stripeCustomer?.balance ?? 0}`),true)}`}
              variant="default"
            />
            <Chip
              avatar={<Avatar alt="avatar"
                src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              />}
              label={user?.name}
              onClick={handleMenu}
              variant="default"
            />
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  noWrap
                  color="textPrimary"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    textDecoration: "none",
                    fontFamily: "Poppins",
                  }}>
                  Logged in as
                </Typography>
                <Typography
                  noWrap
                  color="textPrimary"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginBottom: 10,
                    fontWeight: 700,
                    textDecoration: "none",
                    fontFamily: "Poppins",
                  }}>
                  {user?.email}
                </Typography>
                <Divider />
              </div>
              <MenuItem onClick={() => {
                handleClose()
                history.push("/home/settings?tab=profile")
              }}>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose()
                  signOut()
                }}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={drawerOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
            }),
          }}>
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}
