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

function ParticipantDetail({ participant }) {
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
          <Typography variant="h5">{participant.name}</Typography>
        </Stack>
        <Typography variant="body2">
          Tanggal Lahir: {formatDate(participant.dob)}
        </Typography>
        <Typography variant="body2">Email: {participant.email}</Typography>
        <Typography variant="body2">Telepon: {participant.phone}</Typography>
        <Typography variant="body2">
          Tanggal Registrasi: {formatDate(participant.registrationDate)}
        </Typography>
        <Typography variant="body2">Status: {participant.status}</Typography>
        <Typography variant="body2">
          Status Check-up: {participant.checkUpStatus}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}>
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
};

export default ParticipantDetail;
