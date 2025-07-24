import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEvent,
  getParticipantsByEvent,
  deleteParticipant,
} from "../utils/local-data";
import ParticipantTable from "../components/ParticipantTable";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function EventParticipantsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    setEvent(getEvent(eventId));
    const participantsData = getParticipantsByEvent(eventId);
    setParticipants(participantsData);
    console.log("Participants for event", eventId, participantsData);
  }, [eventId]);

  const handleDelete = (id) => {
    deleteParticipant(id);
    setParticipants(getParticipantsByEvent(eventId));
  };

  if (!event) {
    return <div>Event tidak ditemukan.</div>;
  }

  return (
    <section className="event-participants-page">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Peserta untuk: {event.name}</Typography>
        <Typography variant="body2">Kapasitas: {event.capacity}</Typography>
        <Typography variant="body2">
          Jumlah Peserta: {participants.length}
        </Typography>
      </Box>
      <ParticipantTable participants={participants} />
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        onClick={() => navigate(`/events/${eventId}/participants/add`)}>
        <AddIcon />
      </Fab>
    </section>
  );
}

export default EventParticipantsPage;
