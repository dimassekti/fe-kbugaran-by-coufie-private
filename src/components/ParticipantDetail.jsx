import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ParticipantDetail({ participant, onCheckMedicalStatus }) {
  const navigate = useNavigate();
  if (!participant) return <div>Peserta tidak ditemukan.</div>;

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}>
          <Typography variant="h5">
            {participant.fullname || participant.name}
          </Typography>
        </Stack>
        <Typography variant="body2">
          Username: {participant.username}
        </Typography>
        <Typography variant="body2">
          Participant Code: {participant.participant_code}
        </Typography>
        <Typography variant="body2">Role: {participant.role}</Typography>
        <Typography variant="body2">Event: {participant.event_name}</Typography>
        <Typography variant="body2">
          Event Date: {formatDate(participant.event_date)}
        </Typography>
        <Typography variant="body2">
          Registration Date: {formatDate(participant.registration_date)}
        </Typography>
        <Typography variant="body2">Status: {participant.status}</Typography>
        {participant.notes && (
          <Typography variant="body2">Notes: {participant.notes}</Typography>
        )}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="info"
            onClick={onCheckMedicalStatus}>
            Cek Status Medis
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(`/participants/${participant.id}/checkup`)}>
            Check-up Result
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

ParticipantDetail.propTypes = {
  participant: PropTypes.object,
  onCheckMedicalStatus: PropTypes.func.isRequired,
};

export default ParticipantDetail;
