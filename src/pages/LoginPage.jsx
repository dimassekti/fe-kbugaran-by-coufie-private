import React, { useState } from "react";
import PropTypes from "prop-types";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { login } from "../utils/api";
import useInput from "../hooks/useInput";

function LoginPage({ loginSuccess }) {
  const [username, onUsernameChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  async function onLogin(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError, data } = await login({ username, password });

    if (!loginError) {
      loginSuccess(data);
    } else {
      setError("Username atau password salah. Silakan coba lagi.");
    }
    setLoading(false);
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        py: 4,
      }}>
      <Container
        maxWidth="sm"
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
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              py: 4,
              textAlign: "center",
            }}>
            <LoginIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="600"
              gutterBottom>
              Selamat Datang
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.9 }}>
              Silakan masuk untuk melanjutkan ke dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={onLogin}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={onUsernameChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Masukkan username Anda"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={password}
                onChange={onPasswordChange}
                required
                sx={{ mb: 4 }}
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
                placeholder="Masukkan password Anda"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                    boxShadow: "0 6px 24px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "rgba(0, 0, 0, 0.12)",
                  },
                  transition: "all 0.3s ease",
                }}
                startIcon={<LoginIcon />}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
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
                Belum punya akun?
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<PersonAddIcon />}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}>
                Daftar Sekarang
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
              color="primary"
              gutterBottom
              fontWeight="600">
              K-Bugaran Platform
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary">
              Sistem manajemen kesehatan dan event terpadu untuk komunitas yang
              lebih sehat
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

LoginPage.propTypes = {
  loginSuccess: PropTypes.func.isRequired,
};

export default LoginPage;
