import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function truncate(text, maxLength) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventItem({ event, onDelete, onEdit }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{event.name}</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          {truncate(event.description, 100)}
        </Typography>
        <Typography variant="body2">
          Tanggal: {formatDate(event.date)}
        </Typography>
        <Typography variant="body2">Lokasi: {event.location}</Typography>
        <Typography variant="body2">
          Penyelenggara: {event.organizer}
        </Typography>
        <Typography variant="body2">Kapasitas: {event.capacity}</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/events/${event.id}`)}>
          Detail
        </Button>
        <Button
          size="small"
          onClick={() => onEdit && onEdit(event.id)}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete && onDelete(event.id)}>
          Hapus
        </Button>
      </CardActions>
    </Card>
  );
}

EventItem.propTypes = {
  event: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default EventItem;
