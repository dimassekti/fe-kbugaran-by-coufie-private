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

/*
  DIALOG VALIDATION PATTERN IMPLEMENTATION
  =======================================
  
  This dialog component demonstrates proper error handling and validation 
  for modal forms. Key patterns implemented:

  1. DUAL ERROR HANDLING
     - Backend errors (props.error): Server validation, business logic errors
     - Client errors (formError): Immediate form validation, required fields

  2. ERROR PRIORITY
     - Backend errors take visual priority and clear client errors
     - Prevents confusion when both types of errors might occur

  3. CLEAN STATE MANAGEMENT
     - Form resets when dialog opens
     - Errors clear when user interacts with form
     - Fresh state prevents stale error messages

  4. VALIDATION STRATEGY
     - Client-side: Fast feedback for obvious issues (required fields)
     - Server-side: Complex validation delegated to backend
     - Optimal balance between UX and reliability

  REUSABLE PATTERNS:
  ================
  - useEffect for dialog open/close cleanup
  - Error display hierarchy (backend > client)
  - Form state management with error clearing
  - Proper prop-based error integration
*/

function AddParticipantDialog({
  open,
  onClose,
  onSubmit,
  users,
  loading,
  error,
  participants,
}) {
  const [formData, setFormData] = useState({
    username: "",
    role: "participant",
  });

  // VALIDATION PATTERN: Client-Side Form Validation State
  // ====================================================
  // Separate from backend validation errors (passed via props.error)
  // This handles immediate form validation (required fields, format, etc.)
  const [formError, setFormError] = useState("");

  // VALIDATION PATTERN: Reset Form State on Dialog Open
  // ==================================================
  // Clear form data and errors when dialog opens to ensure clean state
  useEffect(() => {
    if (open) {
      setFormData({ username: "", role: "participant" });
      setFormError("");
    }
  }, [open]);

  // VALIDATION PATTERN: Backend Error Priority
  // =========================================
  // When backend validation errors exist (props.error), clear client-side
  // form errors to avoid confusion. Backend errors take precedence.
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

    // VALIDATION PATTERN: Clear Errors on User Input
    // =============================================
    // Clear form errors when user starts typing to provide immediate feedback
    // that they're addressing the validation issue
    if (formError) setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // VALIDATION PATTERN: Client-Side Validation Strategy
    // ==================================================
    // Step 1: Clear previous form errors for fresh validation
    setFormError("");

    // Step 2: Required field validation
    if (!formData.username || !formData.username.trim()) {
      setFormError("Username is required and cannot be empty");
      return;
    }

    if (!formData.role) {
      setFormError("Role selection is required");
      return;
    }

    // Step 3: Business logic validation (client-side optimization)
    // Check for duplicates in current participants to provide immediate feedback
    if (participants && participants.length > 0) {
      const existingParticipant = participants.find(
        (p) =>
          p.username?.toLowerCase() === formData.username.trim().toLowerCase()
      );
      if (existingParticipant) {
        setFormError("This username is already a participant in this event");
        return;
      }
    }

    // VALIDATION PATTERN: Delegate Complex Validation to Backend
    // =========================================================
    // Let backend handle username existence validation rather than
    // duplicating complex logic on client-side. This ensures consistency
    // and reduces code duplication.
    onSubmit(formData.username.trim(), formData.role);
  };

  const handleClose = () => {
    setFormData({
      username: "",
      role: "participant",
    });
    setFormError("");
    onClose();
  };

  const roleOptions = [
    { value: "participant", label: "Participant" },
    { value: "organizer", label: "Organizer" },
    { value: "instructor", label: "Instructor" },
    { value: "medical_staff", label: "Medical Staff" },
    { value: "volunteer", label: "Volunteer" },
  ];

  const isAdmin = users && users.length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Tambah Peserta</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* VALIDATION PATTERN: Error Display Hierarchy
              ==========================================
              1. Backend errors (props.error) are displayed first - these come from server validation
              2. Client-side form errors (formError) are displayed second - these are immediate validations
              
              Backend errors take visual priority and override form errors to avoid confusion */}
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
              />
            )}

            {/* Role Selection */}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange("role")}
                label="Role"
                disabled={loading}>
                {roleOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            {loading ? "Adding..." : "Add Participant"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AddParticipantDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  participants: PropTypes.array,
};

AddParticipantDialog.defaultProps = {
  users: [],
  loading: false,
  error: null,
  participants: [],
};

export default AddParticipantDialog;
