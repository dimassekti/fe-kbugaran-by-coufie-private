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
      title: "Easy Event Management",
      description:
        "Create and manage events with our intuitive interface. From planning to execution, we've got you covered with powerful tools and features.",
    },
    {
      icon: <SecurityIcon />,
      title: "Secure Registration",
      description:
        "Protect your attendees' data with enterprise-grade security. All registrations and payments are processed through secure, encrypted channels.",
    },
    {
      icon: <SpeedIcon />,
      title: "Real-time Analytics",
      description:
        "Track event performance with comprehensive analytics. Monitor registrations, engagement, and attendance in real-time dashboards.",
    },
    {
      icon: <PeopleIcon />,
      title: "Mobile Friendly",
      description:
        "Access your events anywhere, anytime. Our responsive design ensures a seamless experience across all devices and platforms.",
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
          spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}>
                <CardContent>
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
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}>
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}>
                    {benefit.description}
                  </Typography>
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
