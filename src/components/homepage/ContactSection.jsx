import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const ContactSection = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setShowSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email Us",
      info: "support@eventmanager.com",
      description: "Send us your questions anytime",
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "Available Mon-Fri, 9AM-6PM",
    },
    {
      icon: <LocationOnIcon />,
      title: "Visit Us",
      info: "123 Event Street, City, State 12345",
      description: "Come visit our office",
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
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
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}>
            Have questions? We're here to help you succeed with your events
          </Typography>
        </Box>

        <Grid
          container
          spacing={6}>
          {/* Contact Information */}
          <Grid
            item
            xs={12}
            md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
              }}>
              Contact Information
            </Typography>

            {contactInfo.map((contact, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 4,
                }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.light,
                    color: "white",
                    mr: 3,
                    flexShrink: 0,
                  }}>
                  {contact.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: theme.palette.text.primary,
                    }}>
                    {contact.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      color: theme.palette.primary.main,
                    }}>
                    {contact.info}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary">
                    {contact.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>

          {/* Contact Form */}
          <Grid
            item
            xs={12}
            md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 4,
                color: theme.palette.text.primary,
              }}>
              Send us a Message
            </Typography>

            {showSuccess && (
              <Alert
                severity="success"
                sx={{ mb: 3 }}>
                Thank you for your message! We'll get back to you soon.
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease",
                }}>
                Send Message
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
