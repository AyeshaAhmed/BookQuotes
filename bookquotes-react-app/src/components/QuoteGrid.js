import * as React from "react";
import Box from "@mui/material/Box";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";


const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      bigMobile: 350,
      tablet: 650,
      desktop: 900
    }
  }
});

const QuoteGrid = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: 450,
          display: "grid",
          gridTemplateColumns: {
            mobile: "repeat(1, 1fr)",
            bigMobile: "repeat(2, 1fr)",
            tablet: "repeat(3, 1fr)",
            desktop: "repeat(4, 1fr)"
          },
          [`& .${imageListItemClasses.root}`]: {
            display: "flex",
            flexDirection: "column"
          }
        }}
      >
          {props.gridItems}
      </Box>
    </ThemeProvider>
  );
}

export default QuoteGrid; 