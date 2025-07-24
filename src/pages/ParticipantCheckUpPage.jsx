import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getParticipant } from "../utils/local-data";
import ParticipantCheckUpDetail from "../components/ParticipantCheckUpDetail";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function ParticipantCheckUpPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParticipant(getParticipant(participantId));
    setLoading(false);
  }, [participantId]);

  if (loading) {
    return <div>Memuat data check-up...</div>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Detail Check-up Peserta
      </Typography>
      <ParticipantCheckUpDetail
        checkUpDetails={participant?.checkUpDetails}
        checkUpHistory={participant?.checkUpHistory}
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

export default ParticipantCheckUpPage;
