import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getParticipant } from "../utils/local-data";
import ParticipantDetail from "../components/ParticipantDetail";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function ParticipantDetailPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParticipant(getParticipant(participantId));
    setLoading(false);
  }, [participantId]);

  if (loading) {
    return <div>Memuat detail peserta...</div>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Detail Peserta
      </Typography>
      <ParticipantDetail participant={participant} />
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
