"use client";

import React, { useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useBrand } from "@/context/BrandContext";

const DynamicThemeProvider = ({ children }) => {
  const { brandColors } = useBrand();

  const theme = useMemo(() =>
    createTheme({
      palette: {
        primary: {
          main: brandColors?.primaryColor || "#9306FF",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: brandColors?.secondaryColor || "#000000",
          contrastText: "#FFFFFF",
        },
        // optional: success, error...
        success: {
          main: "#4CAF50",
          contrastText: "#FFFFFF",
        },
        error: {
          main: "#f44336",
          contrastText: "#FFFFFF",
        },
      },
      components: {
       MuiButton: {
  styleOverrides: {
    root: {
      borderRadius: "8px",
      padding: "10px 20px",
      textTransform: "none",
      fontWeight: 600,
    },
    containedPrimary: {
      backgroundColor: brandColors?.primaryColor || "#9306FF",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: brandColors?.secondaryColor || "#000000",
      },
    },
    containedSecondary: {
      backgroundColor: brandColors?.secondaryColor || "#000000",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#333333",
      },
    },
  },
},

        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 500,
            },
            colorPrimary: {
              backgroundColor: brandColors?.primaryColor || "#9306FF",
              color: "#FFFFFF",
            },
            colorSecondary: {
              backgroundColor: brandColors?.secondaryColor || "#000000",
              color: "#FFFFFF",
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 500,
              "&.Mui-selected": {
                color: brandColors?.primaryColor || "#9306FF",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: brandColors?.primaryColor || "#9306FF",
            },
          },
        },
      },
    }),
    [brandColors]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default DynamicThemeProvider;
