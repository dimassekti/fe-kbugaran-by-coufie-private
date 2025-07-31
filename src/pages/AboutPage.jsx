import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const AboutPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmailToYourEmail = async (data) => {
    // This is a mock function - replace with your actual email service
    // Example using fetch to send to your backend email service:

    try {
      // Option 1: Using your own backend email service
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "your-email@example.com", // Replace with your actual email
          subject: `New Contact Form Message from ${data.name}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, "<br>")}</p>
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      return { success: true };
    } catch (error) {
      // If backend is not available, you can use EmailJS or similar service
      console.log("Email would be sent with this data:", data);

      // Simulate success for demo purposes
      // In real implementation, replace this with actual email service
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill in all fields");
      }

      // Send email
      const result = await sendEmailToYourEmail(formData);

      if (result.success) {
        setNotification({
          open: true,
          message: "Pesan berhasil dikirim! Kami akan segera merespons.",
          severity: "success",
        });

        // Reset form
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Gagal mengirim pesan. Silakan coba lagi.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 4,
              textAlign: "center",
            }}>
            About Our Platform
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              textAlign: "center",
              mb: 6,
              lineHeight: 1.8,
            }}>
            We are dedicated to revolutionizing event management through
            innovative technology and exceptional service. Our platform provides
            comprehensive solutions for organizing, managing, and executing
            successful events of all sizes.
          </Typography>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ mb: 6 }}>
            <Grid
              item
              xs={12}
              md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 600, mb: 1 }}>
                  500+
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary">
                  Events Managed
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 600, mb: 1 }}>
                  10K+
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary">
                  Happy Participants
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 600, mb: 1 }}>
                  99%
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary">
                  Satisfaction Rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ py: 8 }}>
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
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
                letterSpacing: 1,
              }}>
              Contact Us
            </Typography>
          </Box>

          <Grid
            container
            spacing={6}
            alignItems="flex-start"
            justifyContent="center"
            sx={{
              flexWrap: { xs: "wrap", md: "nowrap" },
              alignItems: "flex-start",
              justifyContent: "center",
            }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <EmailIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: theme.palette.primary.main,
                      }}>
                      Email Us
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ fontWeight: 500 }}>
                      dimassekti.adji@gmail.com
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary">
                      Send us your questions anytime
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <LinkedInIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: theme.palette.primary.main,
                      }}>
                      https://www.linkedin.com/in/dimassekti/
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ fontWeight: 500 }}>
                      <a
                        href="https://www.linkedin.com/in/dimassekti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}>
                        Dimas Sekti Adji
                      </a>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary">
                      Connect with us on LinkedIn
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      p: 1.5,
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <GitHubIcon sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: theme.palette.primary.main,
                      }}>
                      GitHub
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ fontWeight: 500 }}>
                      <a
                        href="https://github.com/dimassekti"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}>
                        github.com/dimassekti
                      </a>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary">
                      Visit our GitHub repository
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Contact Form - RIGHT */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
                      placeholder="Your Name *"
                    />

                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
                      placeholder="Email Address *"
                    />

                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      variant="outlined"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
                      placeholder="Message *"
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={true}
                      startIcon={<SendIcon />}
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
                        "&:disabled": {
                          backgroundColor: "rgba(0, 0, 0, 0.12)",
                        },
                        transition: "all 0.3s ease",
                      }}>
                      Send Message (Disabled)
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AboutPage;
