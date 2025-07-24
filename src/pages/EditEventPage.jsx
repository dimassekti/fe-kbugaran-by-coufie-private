import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventInput from "../components/EventInput";
import { getEvent, updateEvent } from "../utils/local-data";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getEvent(id);
    setEvent(data);
    setLoading(false);
  }, [id]);

  const onUpdateEventHandler = (eventData) => {
    updateEvent(id, eventData);
    navigate(`/events/${id}`);
  };

  if (loading) {
    return <div>Memuat data event...</div>;
  }

  return (
    <section className="edit-event-page">
      <h2>Edit Event</h2>
      <EventInput
        event={event}
        editing
        onSubmit={onUpdateEventHandler}
      />
    </section>
  );
}

export default EditEventPage;
