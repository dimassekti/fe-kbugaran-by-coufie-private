import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getParticipantById } from "../utils/api";
import ParticipantDetail from "../components/ParticipantDetail";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function ParticipantDetailPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipant = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getParticipantById(participantId);

        if (response.error) {
          setError(response.message);
          setParticipant(null);
        } else {
          setParticipant(response.data);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data peserta");
        console.error("Error fetching participant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [participantId]);

  const handleCheckMedicalStatus = () => {
    navigate(`/participants/${participantId}/checkup`);
  };

  if (loading) {
    return <div>Memuat detail peserta...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Detail Peserta
      </Typography>
      <ParticipantDetail
        participant={participant}
        onCheckMedicalStatus={handleCheckMedicalStatus}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </Box>
    </Box>
  );
}

export default ParticipantDetailPage;
