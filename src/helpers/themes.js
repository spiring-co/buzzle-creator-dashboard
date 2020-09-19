import { createMuiTheme } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#3742fa",
    },
    secondary: pink,
    background: {
      default: "#222",
      paper: "#333",
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: "Noto Sans JP",
    fontWeightRegular: 500,
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  overrides: {
    MuiLink: {
      root: {
        fontWeight: 600,
      },
    },
    MuiStepLabel: {
      label: {
        fontWeight: 700,
      },
      active: {
        fontWeight: 700,
      },
    },
    MuiButton: {
      label: {
        fontWeight: 700,
      },
    },
  },
});

export const lightTheme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#3742fa",
    },
    secondary: pink,
  },
  typography: {
    fontSize: 14,
    fontFamily: "Noto Sans JP",
    fontWeightRegular: 500,
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },
  overrides: {
    MuiLink: {
      root: {
        fontWeight: 600,
      },
    },
    MuiStepLabel: {
      label: {
        fontWeight: 700,
      },
      active: {
        fontWeight: 700,
      },
    },
    MuiButton: {
      label: {
        fontWeight: 700,
      },
    },
    MuiTab: {
      wrapper: {
        fontWeight: 700,
        color: "#3742fa",
      },
    },
  },
});
