import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Event as EventIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const BenefitsSection = () => {
  const theme = useTheme();

  const benefits = [
    {
      icon: <EventIcon />,
      title: "Manajemen Mudah",
      description:
        "Buat dan kelola acara dengan antarmuka yang intuitif. Mulai dari perencanaan hingga pelaksanaan, semua dapat dilakukan dengan mudah berkat fitur dan alat yang canggih.",
    },
    {
      icon: <SecurityIcon />,
      title: "Pendaftaran Mudah",
      description:
        "Nikmati proses pendaftaran yang cepat dan antarmuka yang mulus. Dirancang dengan tampilan yang ramah pengguna untuk pengalaman yang nyaman dan efisien.",
    },
    {
      icon: <SpeedIcon />,
      title: "Analitik Waktu Nyata",
      description:
        "Pantau kinerja acara dengan analitik yang lengkap. Lacak pendaftaran, interaksi, dan kehadiran secara langsung melalui dasbor real-time.",
    },
    {
      icon: <PeopleIcon />,
      title: "Anything Anywhere",
      description:
        "Akses acara Anda kapan saja dan di mana saja. Desain responsif kami menjamin pengalaman yang mulus di semua perangkat dan platform.",
    },
  ];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: 8 }}>
      <Container maxWidth="lg">
        <Box
          textAlign="center"
          mb={6}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "2.75rem",
              },
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 2,
            }}>
            Why Choose Our Platform?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}>
            Discover the features that make event management effortless
          </Typography>
        </Box>

        <Grid
          container
          spacing={4}
          sx={{ justifyContent: "center" }}>
          {benefits.map((benefit, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={3}
              key={index}
              sx={{
                display: "flex",
                maxWidth: { xs: "100%", sm: "50%", md: "50%", lg: "25%" },
              }}>
              <Card
                sx={{
                  height: "100%",
                  minHeight: "350px",
                  width: "100%",
                  maxWidth: "280px",
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  p: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}>
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.light,
                      color: "white",
                      mx: "auto",
                      mb: 3,
                      fontSize: "2rem",
                    }}>
                    {benefit.icon}
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: theme.palette.text.primary,
                        minHeight: "3rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        minHeight: "120px",
                        display: "flex",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BenefitsSection;
