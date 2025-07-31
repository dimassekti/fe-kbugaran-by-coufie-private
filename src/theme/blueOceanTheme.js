import { createTheme } from "@mui/material/styles";

const blueOceanTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#0277BD",
        light: "#29B6F6",
        dark: "#01579B",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#00ACC1",
        light: "#4FC3F7",
        dark: "#00838F",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#e3f2fd" : "#0a1929",
        paper: mode === "light" ? "#ffffff" : "#1e293b",
      },
      text: {
        primary: mode === "light" ? "#1a202c" : "#e2e8f0",
        secondary: mode === "light" ? "#4a5568" : "#94a3b8",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "3.5rem",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: "2.75rem",
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: "2.25rem",
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 500,
        fontSize: "1.875rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 500,
        fontSize: "1.5rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 500,
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 12,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 12,
            padding: "12px 24px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
            borderRadius: 16,
          },
        },
      },
    },
  });

export default blueOceanTheme;
