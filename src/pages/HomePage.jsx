import React, { useContext } from "react";
import { Box, ThemeProvider } from "@mui/material";
import ThemeContext from "../contexts/ThemeContext";
import blueOceanTheme from "../theme/blueOceanTheme";
import {
  HeroCarousel,
  EventPreviewSection,
  BenefitsSection,
  ContactSection,
} from "../components/homepage";

const HomePage = () => {
  const { theme } = useContext(ThemeContext);
  const currentTheme = blueOceanTheme(theme);

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ minHeight: "100vh" }}>
        {/* Hero Carousel Section */}
        <HeroCarousel />

        {/* Event Preview Section */}
        <EventPreviewSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Contact Section */}
        <ContactSection />
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
