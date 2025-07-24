import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEvent,
  deleteEvent,
  getParticipantsByEvent,
} from "../utils/local-data";
import EventDetail from "../components/EventDetail";

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getEvent(id);
    const participants = getParticipantsByEvent(id);
    setEvent(data);
    setParticipantCount(participants.length);
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    deleteEvent(id);
    navigate("/events");
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/events");
  };

  if (loading) {
    return <div>Memuat detail event...</div>;
  }

  return (
    <EventDetail
      event={event}
      participantCount={participantCount}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}

export default EventDetailPage;
