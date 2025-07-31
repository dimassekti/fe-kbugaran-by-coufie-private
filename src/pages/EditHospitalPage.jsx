import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import { getHospitalById, updateHospital } from "../utils/api";
import ErrorAlert from "../components/ErrorAlert";

function EditHospitalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const [success, setSuccess] = useState({ show: false, message: "" });

  // Load hospital data on component mount
  useEffect(() => {
    const loadHospital = async () => {
      try {
        setLoading(true);
        const result = await getHospitalById(id);

        if (result.error) {
          setError({
            show: true,
            message: result.message || "Failed to load hospital data",
            type: result.type || "error",
          });
          return;
        }

        if (result.data) {
          setFormData({
            name: result.data.name || "",
            address: result.data.address || "",
            phone: result.data.phone || "",
          });
        }
      } catch (error) {
        setError({
          show: true,
          message: "An unexpected error occurred while loading hospital data",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadHospital();
    }
  }, [id]);

  // Form validation function
  const validateForm = () => {
    if (!formData.name?.trim()) {
      return "Hospital name is required";
    }
    if (formData.name.length > 255) {
      return "Hospital name must not exceed 255 characters";
    }
    if (!formData.address?.trim()) {
      return "Hospital address is required";
    }
    if (formData.address.length > 500) {
      return "Hospital address must not exceed 500 characters";
    }
    if (!formData.phone?.trim()) {
      return "Phone number is required";
    }
    if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      return "Phone number can only contain numbers, +, -, spaces, and parentheses";
    }
    if (formData.phone.length < 8 || formData.phone.length > 20) {
      return "Phone number must be between 8 and 20 characters";
    }
    return null;
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous errors when user starts typing
    if (error.show) {
      setError((prev) => ({ ...prev, show: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError({
        show: true,
        message: validationError,
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);
      setError({ show: false, message: "", type: "error" });

      const result = await updateHospital(id, {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      });

      if (result.error) {
        setError({
          show: true,
          message: result.message,
          type: result.type || "error",
        });
        return;
      }

      // Success
      setSuccess({
        show: true,
        message: "Hospital updated successfully!",
      });

      // Navigate back to hospitals list after a short delay
      setTimeout(() => {
        navigate("/hospitals");
      }, 2000);
    } catch (error) {
      setError({
        show: true,
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate("/hospitals");
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px">
          <CircularProgress />
          <Typography
            variant="body1"
            sx={{ ml: 2 }}>
            Loading hospital data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center">
          Edit Hospital
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}>
          <Grid
            container
            spacing={3}>
            <Grid
              item
              xs={12}>
              <TextField
                name="name"
                label="Hospital Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ maxLength: 255 }}
                helperText={`${formData.name.length}/255 characters`}
                disabled={submitting}
              />
            </Grid>

            <Grid
              item
              xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.address.length}/500 characters`}
                disabled={submitting}
              />
            </Grid>

            <Grid
              item
              xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ maxLength: 20 }}
                helperText="Numbers, +, -, spaces, and parentheses only (8-20 characters)"
                disabled={submitting}
              />
            </Grid>

            <Grid
              item
              xs={12}>
              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={submitting}
                  size="large">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  size="large"
                  startIcon={
                    submitting ? <CircularProgress size={20} /> : null
                  }>
                  {submitting ? "Updating..." : "Update Hospital"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Error Alert */}
      <ErrorAlert
        message={error.message}
        severity={error.type}
        open={error.show}
        onClose={() => setError((prev) => ({ ...prev, show: false }))}
      />

      {/* Success Alert */}
      <ErrorAlert
        message={success.message}
        severity="success"
        open={success.show}
        onClose={() => setSuccess((prev) => ({ ...prev, show: false }))}
      />
    </Container>
  );
}

export default EditHospitalPage;
