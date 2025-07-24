import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventDetail({ event, participantCount, onEdit, onDelete, onBack }) {
  const navigate = useNavigate();
  if (!event) return <div>Event tidak ditemukan.</div>;
  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}>
          <Typography variant="h5">{event.name}</Typography>
          <Chip
            label={event.category}
            color="primary"
          />
        </Stack>
        <Typography
          variant="body1"
          sx={{ mb: 2 }}>
          {event.description}
        </Typography>
        <Typography variant="body2">
          Tanggal: {formatDate(event.date)}
        </Typography>
        <Typography variant="body2">Lokasi: {event.location}</Typography>
        <Typography variant="body2">
          Penyelenggara: {event.organizer}
        </Typography>
        <Typography variant="body2">
          Participants: {participantCount}/{event.capacity}
        </Typography>
        <Typography variant="body2">
          Status: {event.status || "Aktif"}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}>
            Hapus
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/events/${event.id}/participants`)}>
            View Participants
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}>
            Kembali
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

EventDetail.propTypes = {
  event: PropTypes.object,
  participantCount: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBack: PropTypes.func,
};

export default EventDetail;
