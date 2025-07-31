import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const HeroCarousel = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      image: "https://picsum.photos/1200/600?random=1",
      title: "Manajemen Acara yang Mudah",
      subtitle:
        "Buat dan kelola acara dengan antarmuka yang intuitif. Mulai dari perencanaan hingga pelaksanaan, semua dapat dilakukan dengan mudah berkat fitur dan alat yang canggih.",
      buttonText: "Get Started",
      action: () => navigate("/events"),
    },
    {
      id: 2,
      image: "https://picsum.photos/1200/600?random=2",
      title: "Pendaftaran Mudah",
      subtitle:
        "Nikmati proses pendaftaran yang cepat dan antarmuka yang mulus. Dirancang dengan tampilan yang ramah pengguna untuk pengalaman yang nyaman dan efisien.",
      buttonText: "Explore Events",
      action: () => navigate("/events"),
    },
    {
      id: 3,
      image: "https://picsum.photos/1200/600?random=3",
      title: "Analitik Waktu Nyata",
      subtitle:
        "Pantau kinerja acara dengan analitik yang lengkap. Lacak pendaftaran, interaksi, dan kehadiran secara langsung melalui dasbor real-time.",
      buttonText: "Learn More",
      action: () => navigate("/events"),
    },
    {
      id: 4,
      image: "https://picsum.photos/1200/600?random=4",
      title: "Ramah untuk Perangkat Mobile",
      subtitle:
        "Akses acara Anda kapan saja dan di mana saja. Desain responsif kami menjamin pengalaman yang mulus di semua perangkat dan platform.",
      buttonText: "View Features",
      action: () => navigate("/events"),
    },
  ];

  return (
    <Box
      sx={{ position: "relative", width: "100%", mb: 6 }}
      className="hero-carousel">
      <Carousel
        autoPlay={true}
        animation="slide"
        duration={500}
        interval={5000}
        indicators={true}
        navButtonsAlwaysVisible={true}
        sx={{
          height: {
            xs: "400px",
            sm: "500px",
            md: "600px",
          },
        }}>
        {slides.map((slide) => (
          <Box
            key={slide.id}
            sx={{
              position: "relative",
              height: {
                xs: "400px",
                sm: "500px",
                md: "600px",
              },
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(2, 119, 189, 0.4)",
                zIndex: 1,
              },
            }}>
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                color: "white",
                maxWidth: "800px",
                px: 3,
              }}
              className="carousel-content">
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.5rem",
                  },
                  fontWeight: 700,
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}>
                {slide.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                  },
                  fontWeight: 400,
                  mb: 4,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}>
                {slide.subtitle}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={slide.action}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease",
                }}>
                {slide.buttonText}
              </Button>
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default HeroCarousel;
