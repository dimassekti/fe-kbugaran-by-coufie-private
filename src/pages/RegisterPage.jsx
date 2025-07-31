import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { register } from "../utils/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Informasi Pribadi", "Akun & Keamanan", "Konfirmasi"];

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  async function onRegisterHandler(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.fullname || !formData.username || !formData.password) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      setLoading(false);
      return;
    }

    const { error: registerError } = await register(formData);
    if (!registerError) {
      navigate("/login");
    } else {
      setError("Gagal mendaftar. Username mungkin sudah terdaftar.");
    }
    setLoading(false);
  }

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.fullname.length >= 2;
      case 1:
        return formData.username.length >= 3 && formData.password.length >= 6;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            fullWidth
            label="Nama Lengkap"
            variant="outlined"
            value={formData.fullname}
            onChange={handleInputChange("fullname")}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Masukkan nama lengkap Anda"
            helperText="Minimal 2 karakter"
          />
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={formData.username}
              onChange={handleInputChange("username")}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Pilih username unik"
              helperText="Minimal 3 karakter, akan digunakan untuk login"
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange("password")}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Buat password yang aman"
              helperText="Minimal 6 karakter"
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              color="primary"
              fontWeight="600">
              Konfirmasi Data Pendaftaran
            </Typography>
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography
                variant="body1"
                sx={{ mb: 1 }}>
                <strong>Nama Lengkap:</strong> {formData.fullname}
              </Typography>
              <Typography variant="body1">
                <strong>Username:</strong> {formData.username}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary">
              Pastikan data yang Anda masukkan sudah benar sebelum melanjutkan.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        py: 4,
      }}>
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1 }}>
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              color: "white",
              py: 4,
              textAlign: "center",
            }}>
            <PersonAddIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="600"
              gutterBottom>
              Buat Akun Baru
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9 }}>
              Bergabunglah dengan K-Bugaran untuk pengalaman kesehatan yang
              lebih baik
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={onRegisterHandler}>
              {renderStepContent(activeStep)}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ mr: 1 }}>
                  Kembali
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                      boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
                        boxShadow: "0 6px 24px rgba(76, 175, 80, 0.4)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    startIcon={<PersonAddIcon />}>
                    {loading ? "Mendaftar..." : "Daftar Sekarang"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!isStepValid(activeStep)}
                    sx={{
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)",
                      },
                    }}>
                    Lanjutkan
                  </Button>
                )}
              </Box>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary">
                atau
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}>
                Sudah punya akun?
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "success.main",
                  color: "success.main",
                  "&:hover": {
                    borderColor: "success.dark",
                    backgroundColor: "rgba(76, 175, 80, 0.04)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}>
                Masuk ke Akun
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Box
          mt={3}
          textAlign="center">
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}>
            <Typography
              variant="h6"
              color="success.main"
              gutterBottom
              fontWeight="600">
              Mengapa Bergabung dengan K-Bugaran?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary">
              Akses ke event kesehatan, jaringan rumah sakit terpercaya, dan
              komunitas yang peduli kesehatan
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default RegisterPage;
