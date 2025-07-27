import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getParticipantById,
  getParticipantMedicalStatus,
  createParticipantCheckup,
  updateParticipantCheckup,
} from "../utils/api";
import ParticipantCheckUpDetail from "../components/ParticipantCheckUpDetail";
import CheckupForm from "../components/CheckupForm";
import { exportCheckupToPDF } from "../utils/pdfExport";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Snackbar, Alert } from "@mui/material";

function ParticipantCheckUpPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form-related state
  const [showCheckupForm, setShowCheckupForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchParticipantAndMedicalData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, get participant details to extract eventId and userId
        const participantResponse = await getParticipantById(participantId);

        if (participantResponse.error) {
          setError(participantResponse.message);
          return;
        }

        const participantData = participantResponse.data;
        setParticipant(participantData);

        // Then get medical status using eventId and userId
        const medicalResponse = await getParticipantMedicalStatus(
          participantData.event_id,
          participantData.user_id
        );

        if (medicalResponse.error) {
          // If no medical data exists, it's not necessarily an error
          if (
            medicalResponse.message.includes("tidak ditemukan") ||
            medicalResponse.message.includes("not found")
          ) {
            setMedicalData(null); // No medical data available
          } else {
            setError(medicalResponse.message);
          }
        } else {
          setMedicalData(medicalResponse.data);
          console.log("Medical data received:", medicalResponse.data); // Debug log
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data check-up");
        console.error("Error fetching participant checkup data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantAndMedicalData();
  }, [participantId]);

  const handleFillCheckup = () => {
    setShowCheckupForm(true);
    setFormError(null);
  };

  const handleEditCheckup = () => {
    setShowCheckupForm(true);
    setFormError(null);
  };

  const handleCloseForm = () => {
    setShowCheckupForm(false);
    setFormError(null);
  };

  const handleSubmitCheckup = async (checkupData) => {
    setFormLoading(true);
    setFormError(null);

    try {
      let response;

      if (medicalData) {
        // Edit mode - update existing checkup
        response = await updateParticipantCheckup(
          participant.event_id,
          participant.user_id,
          checkupData
        );
      } else {
        // Create mode - create new checkup
        const checkupPayload = {
          ...checkupData,
          userId: participant.user_id,
        };
        response = await createParticipantCheckup(
          participant.event_id,
          checkupPayload
        );
      }

      if (response.error) {
        setFormError(response.message);
        return;
      }

      // Success - close form and refresh data
      setShowCheckupForm(false);
      setSuccessMessage(
        medicalData
          ? "Checkup updated successfully!"
          : "Checkup created successfully!"
      );

      // Refresh medical data
      const medicalResponse = await getParticipantMedicalStatus(
        participant.event_id,
        participant.user_id
      );

      if (!medicalResponse.error) {
        setMedicalData(medicalResponse.data);
      }
    } catch (err) {
      setFormError("An unexpected error occurred while saving checkup");
      console.error("Error saving checkup:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!participant) {
      setError("Participant data not available for export");
      return;
    }

    // Extract the actual checkup data from medicalData
    const checkupData = medicalData?.checkup || medicalData;
    const result = exportCheckupToPDF(participant, checkupData);

    if (result.success) {
      setSuccessMessage(`PDF exported successfully: ${result.filename}`);
    } else {
      setError(result.error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  if (loading) {
    return <div>Memuat data check-up...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Detail Check-up Peserta
      </Typography>
      {participant && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Peserta:</strong> {participant.fullname} (
            {participant.username})
          </Typography>
          <Typography variant="body2">
            <strong>Event:</strong> {participant.event_name}
          </Typography>
        </Box>
      )}
      <ParticipantCheckUpDetail
        checkUpDetails={medicalData?.checkup || medicalData?.checkUpDetails}
        checkUpHistory={medicalData?.checkUpHistory}
        medicalData={medicalData}
        noDataMessage={
          !medicalData
            ? "Belum ada data medical check-up untuk peserta ini"
            : undefined
        }
        onEdit={handleEditCheckup}
        onExport={handleExportPDF}
        onFillCheckup={handleFillCheckup}
      />

      <CheckupForm
        open={showCheckupForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCheckup}
        initialData={medicalData}
        loading={formLoading}
        error={formError}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ParticipantCheckUpPage;
