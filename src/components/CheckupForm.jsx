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
  Grid,
} from "@mui/material";

function CheckupForm({ open, onClose, onSubmit, initialData, loading, error }) {
  const [formData, setFormData] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    weight: "",
    height: "",
    medicalConditions: "",
    medications: "",
    fitnessLevel: "",
    checkedBy: "",
  });
  const [formError, setFormError] = useState("");

  // Clear form data and errors when dialog opens
  useEffect(() => {
    if (open) {
      if (initialData && initialData.checkup) {
        // Edit mode - populate with existing data from backend format
        const checkupData = initialData.checkup;
        setFormData({
          bloodPressureSystolic: checkupData.blood_pressure_systolic || "",
          bloodPressureDiastolic: checkupData.blood_pressure_diastolic || "",
          heartRate: checkupData.heart_rate || "",
          weight: checkupData.weight || "",
          height: checkupData.height || "",
          medicalConditions: checkupData.medical_conditions || "",
          medications: checkupData.medications || "",
          fitnessLevel: checkupData.fitness_level || "",
          checkedBy: checkupData.checked_by || "",
        });
      } else if (initialData) {
        // Edit mode - populate with existing data (fallback format)
        setFormData({
          bloodPressureSystolic: initialData.blood_pressure_systolic || "",
          bloodPressureDiastolic: initialData.blood_pressure_diastolic || "",
          heartRate: initialData.heart_rate || "",
          weight: initialData.weight || "",
          height: initialData.height || "",
          medicalConditions: initialData.medical_conditions || "",
          medications: initialData.medications || "",
          fitnessLevel: initialData.fitness_level || "",
          checkedBy: initialData.checked_by || "",
        });
      } else {
        // Create mode - reset form
        setFormData({
          bloodPressureSystolic: "",
          bloodPressureDiastolic: "",
          heartRate: "",
          weight: "",
          height: "",
          medicalConditions: "",
          medications: "",
          fitnessLevel: "",
          checkedBy: "",
        });
      }
      setFormError("");
    }
  }, [open, initialData]);

  // Clear form error when backend error exists (backend error takes priority)
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
    if (formError) setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous form errors
    setFormError("");

    // Basic validation
    if (!formData.bloodPressureSystolic || !formData.bloodPressureDiastolic) {
      setFormError("Blood pressure (systolic and diastolic) is required");
      return;
    }

    if (!formData.heartRate) {
      setFormError("Heart rate is required");
      return;
    }

    if (!formData.weight || !formData.height) {
      setFormError("Weight and height are required");
      return;
    }

    if (!formData.checkedBy) {
      setFormError("Checked by field is required");
      return;
    }

    // Validate numeric fields
    const numericFields = {
      bloodPressureSystolic: "Blood pressure systolic",
      bloodPressureDiastolic: "Blood pressure diastolic",
      heartRate: "Heart rate",
      weight: "Weight",
      height: "Height",
    };

    for (const [field, label] of Object.entries(numericFields)) {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value <= 0) {
        setFormError(`${label} must be a valid positive number`);
        return;
      }
    }

    // Validate blood pressure ranges
    const systolic = parseFloat(formData.bloodPressureSystolic);
    const diastolic = parseFloat(formData.bloodPressureDiastolic);

    if (systolic < 70 || systolic > 250) {
      setFormError("Systolic blood pressure should be between 70-250 mmHg");
      return;
    }

    if (diastolic < 40 || diastolic > 150) {
      setFormError("Diastolic blood pressure should be between 40-150 mmHg");
      return;
    }

    if (systolic <= diastolic) {
      setFormError(
        "Systolic pressure should be higher than diastolic pressure"
      );
      return;
    }

    // Validate heart rate
    const heartRate = parseFloat(formData.heartRate);
    if (heartRate < 30 || heartRate > 250) {
      setFormError("Heart rate should be between 30-250 bpm");
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      weight: "",
      height: "",
      medicalConditions: "",
      medications: "",
      fitnessLevel: "",
      checkedBy: "",
    });
    setFormError("");
    onClose();
  };

  const fitnessLevelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth>
      <DialogTitle>
        {initialData ? "Edit Medical Checkup" : "Fill Medical Checkup"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
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
            {/* Blood Pressure Section */}
            <Grid
              container
              spacing={2}>
              <Grid
                item
                xs={6}>
                <TextField
                  label="Systolic Blood Pressure (mmHg)"
                  type="number"
                  value={formData.bloodPressureSystolic}
                  onChange={handleChange("bloodPressureSystolic")}
                  fullWidth
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
              <Grid
                item
                xs={6}>
                <TextField
                  label="Diastolic Blood Pressure (mmHg)"
                  type="number"
                  value={formData.bloodPressureDiastolic}
                  onChange={handleChange("bloodPressureDiastolic")}
                  fullWidth
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
            </Grid>

            {/* Vital Signs */}
            <TextField
              label="Heart Rate (bpm)"
              type="number"
              value={formData.heartRate}
              onChange={handleChange("heartRate")}
              fullWidth
              inputProps={{ min: 0, step: 1 }}
            />

            <Grid
              container
              spacing={2}>
              <Grid
                item
                xs={6}>
                <TextField
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange("weight")}
                  fullWidth
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid
                item
                xs={6}>
                <TextField
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={handleChange("height")}
                  fullWidth
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
            </Grid>

            {/* Medical Information */}
            <TextField
              label="Medical Conditions"
              value={formData.medicalConditions}
              onChange={handleChange("medicalConditions")}
              multiline
              rows={3}
              fullWidth
              placeholder="Enter any existing medical conditions or write 'None' if no conditions"
            />

            <TextField
              label="Current Medications"
              value={formData.medications}
              onChange={handleChange("medications")}
              multiline
              rows={3}
              fullWidth
              placeholder="List current medications or write 'None' if no medications"
            />

            {/* Fitness Level */}
            <FormControl fullWidth>
              <InputLabel>Fitness Level</InputLabel>
              <Select
                value={formData.fitnessLevel}
                onChange={handleChange("fitnessLevel")}
                label="Fitness Level">
                {fitnessLevelOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Checked By */}
            <TextField
              label="Checked By (Medical Staff Name)"
              value={formData.checkedBy}
              onChange={handleChange("checkedBy")}
              fullWidth
              placeholder="Enter the name of medical staff conducting the checkup"
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
            startIcon={loading ? <CircularProgress size={20} /> : null}>
            {loading
              ? "Saving..."
              : initialData
              ? "Update Checkup"
              : "Save Checkup"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

CheckupForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

CheckupForm.defaultProps = {
  initialData: null,
  loading: false,
  error: null,
};

export default CheckupForm;
