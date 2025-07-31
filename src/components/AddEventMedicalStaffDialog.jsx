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
  Autocomplete,
} from "@mui/material";

function AddEventMedicalStaffDialog({
  open,
  onClose,
  onSubmit,
  availableStaff,
  loading,
  error,
  currentMedicalStaff,
}) {
  const [formData, setFormData] = useState({
    staffId: "",
    assignmentRole: "",
    notes: "",
  });

  // Client-side form validation state
  const [formError, setFormError] = useState("");

  // Reset form state on dialog open
  useEffect(() => {
    if (open) {
      setFormData({
        staffId: "",
        assignmentRole: "",
        notes: "",
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

  const handleChange = (field) => (event, value) => {
    if (field === "staffId" && value) {
      // Handle Autocomplete component
      setFormData({
        ...formData,
        [field]: value.id,
      });
    } else {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    }

    // Clear form errors when user starts typing
    if (formError) setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous form errors
    setFormError("");

    // Required field validation
    if (!formData.staffId) {
      setFormError("Staff selection is required");
      return;
    }

    if (!formData.assignmentRole || !formData.assignmentRole.trim()) {
      setFormError("Assignment role is required");
      return;
    }

    // Check for duplicates in current medical staff
    if (currentMedicalStaff && currentMedicalStaff.length > 0) {
      const existingStaff = currentMedicalStaff.find(
        (s) => s.staffId === formData.staffId
      );
      if (existingStaff) {
        setFormError("This staff member is already assigned to this event");
        return;
      }
    }

    // Submit with clean data
    const cleanData = {
      staffId: formData.staffId,
      assignmentRole: formData.assignmentRole.trim(),
      notes: formData.notes.trim(),
    };

    onSubmit(cleanData);
  };

  const handleClose = () => {
    setFormData({
      staffId: "",
      assignmentRole: "",
      notes: "",
    });
    setFormError("");
    onClose();
  };

  const assignmentRoles = [
    "Lead Doctor",
    "Assistant Doctor",
    "Head Nurse",
    "Nurse",
    "Emergency Response",
    "Medical Coordinator",
    "Other",
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Tambah Medical Staff ke Event</DialogTitle>
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
            {/* Staff Selection */}
            <Autocomplete
              options={availableStaff || []}
              getOptionLabel={(option) =>
                `${option.staffName} - ${option.hospitalName} (${
                  option.staffRole === "doctor" ? "Dokter" : "Perawat"
                })`
              }
              onChange={handleChange("staffId")}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pilih Staff *"
                  placeholder="Cari nama staff atau rumah sakit"
                  required
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <div>
                      <strong>{option.staffName}</strong>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "gray" }}>
                      {option.hospitalName} -{" "}
                      {option.staffRole === "doctor" ? "Dokter" : "Perawat"}
                      {option.specialization && ` - ${option.specialization}`}
                    </div>
                  </Box>
                </li>
              )}
            />

            {/* Assignment Role Selection */}
            <FormControl fullWidth>
              <InputLabel>Assignment Role *</InputLabel>
              <Select
                value={formData.assignmentRole}
                onChange={handleChange("assignmentRole")}
                label="Assignment Role *"
                disabled={loading}
                required>
                {assignmentRoles.map((role) => (
                  <MenuItem
                    key={role}
                    value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Notes */}
            <TextField
              fullWidth
              label="Catatan"
              value={formData.notes}
              onChange={handleChange("notes")}
              disabled={loading}
              multiline
              rows={3}
              placeholder="Catatan tambahan untuk penugasan ini"
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
            {loading ? "Adding..." : "Add Medical Staff"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddEventMedicalStaffDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  availableStaff: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  currentMedicalStaff: PropTypes.array,
};

AddEventMedicalStaffDialog.defaultProps = {
  availableStaff: [],
  loading: false,
  error: null,
  currentMedicalStaff: [],
};

export default AddEventMedicalStaffDialog;
