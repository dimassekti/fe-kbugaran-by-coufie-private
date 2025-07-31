import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

function AddHospitalStaffDialog({
  open,
  onClose,
  onSubmit,
  users,
  loading,
  error,
  staff,
}) {
  const [formData, setFormData] = useState({
    username: "",
    staffRole: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: "",
  });

  // Client-side form validation state
  const [formError, setFormError] = useState("");

  // Reset form state on dialog open
  useEffect(() => {
    if (open) {
      setFormData({
        username: "",
        staffRole: "",
        specialization: "",
        licenseNumber: "",
        yearsOfExperience: "",
      });
      setFormError("");
    }
  }, [open]);

  // Backend error priority - clear client-side errors when backend errors exist
  useEffect(() => {
    if (error) {
      setFormError("");
    }
  }, [error]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });

    // Clear form errors when user starts typing
    if (formError) setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous form errors
    setFormError("");

    // Required field validation
    if (!formData.username || !formData.username.trim()) {
      setFormError("Username is required and cannot be empty");
      return;
    }

    if (!formData.staffRole) {
      setFormError("Staff role selection is required");
      return;
    }

    // Check for duplicates in current staff
    if (staff && staff.length > 0) {
      const existingStaff = staff.find(
        (s) =>
          s.username?.toLowerCase() ===
            formData.username.trim().toLowerCase() ||
          s.user?.username?.toLowerCase() ===
            formData.username.trim().toLowerCase()
      );
      if (existingStaff) {
        setFormError(
          "This username is already a staff member in this hospital"
        );
        return;
      }
    }

    // Validate years of experience if provided
    if (formData.yearsOfExperience && formData.yearsOfExperience < 0) {
      setFormError("Years of experience cannot be negative");
      return;
    }

    // Submit with clean data
    const cleanData = {
      username: formData.username.trim(),
      staffRole: formData.staffRole,
      specialization: formData.specialization.trim(),
      licenseNumber: formData.licenseNumber.trim(),
      yearsOfExperience: formData.yearsOfExperience
        ? parseInt(formData.yearsOfExperience)
        : null,
    };

    onSubmit(cleanData);
  };

  const handleClose = () => {
    setFormData({
      username: "",
      staffRole: "",
      specialization: "",
      licenseNumber: "",
      yearsOfExperience: "",
    });
    setFormError("");
    onClose();
  };

  const isAdmin = users && users.length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Tambah Staff Rumah Sakit</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* Error display hierarchy - backend errors first, then form errors */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {formError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* User Selection */}
            {isAdmin ? (
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={formData.username}
                  onChange={handleChange("username")}
                  label="Select User"
                  disabled={loading}>
                  {users.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.username}>
                      {user.fullname} ({user.username})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={handleChange("username")}
                disabled={loading}
                placeholder="Enter username"
                required
              />
            )}

            {/* Staff Role Selection */}
            <FormControl fullWidth>
              <InputLabel>Staff Role *</InputLabel>
              <Select
                value={formData.staffRole}
                onChange={handleChange("staffRole")}
                label="Staff Role *"
                disabled={loading}
                required>
                <MenuItem value="doctor">Dokter</MenuItem>
                <MenuItem value="nurse">Perawat</MenuItem>
              </Select>
            </FormControl>

            {/* Specialization */}
            <TextField
              fullWidth
              label="Spesialisasi (Opsional)"
              value={formData.specialization}
              onChange={handleChange("specialization")}
              disabled={loading}
              placeholder="Contoh: Kardiologi, Pediatri (Kosongkan jika tidak ada)"
              helperText="Kosongkan jika tidak memiliki spesialisasi khusus"
            />

            {/* License Number */}
            <TextField
              fullWidth
              label="Nomor Lisensi (Opsional)"
              value={formData.licenseNumber}
              onChange={handleChange("licenseNumber")}
              disabled={loading}
              placeholder="Nomor lisensi praktik (Kosongkan jika tidak ada)"
              helperText="Kosongkan jika belum memiliki lisensi"
            />

            {/* Years of Experience */}
            <TextField
              fullWidth
              label="Pengalaman (Tahun) - Opsional"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleChange("yearsOfExperience")}
              disabled={loading}
              inputProps={{ min: 0 }}
              placeholder="Jumlah tahun pengalaman (Kosongkan jika baru)"
              helperText="Masukkan 0 atau kosongkan jika baru memulai"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}>
            {loading ? "Adding..." : "Add Staff"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddHospitalStaffDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  staff: PropTypes.array,
};

AddHospitalStaffDialog.defaultProps = {
  users: [],
  loading: false,
  error: null,
  staff: [],
};

export default AddHospitalStaffDialog;
