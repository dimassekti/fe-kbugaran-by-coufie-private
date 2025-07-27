import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventInput from "../components/EventInput";
import { getEventById, updateEvent } from "../utils/api";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getEventById(id);

        if (response.error) {
          setError(response.message);
          setEvent(null);
        } else {
          // Support both { data: { event: {...} } } and { data: {...} }
          const eventData = response.data?.event || response.data;
          setEvent(eventData);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data event");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const onUpdateEventHandler = async (eventData) => {
    try {
      const response = await updateEvent(id, eventData);

      if (response.error) {
        setError(response.message);
        return;
      }

      // Success - navigate back to event detail
      navigate(`/events/${id}`);
    } catch (err) {
      setError("Terjadi kesalahan saat mengupdate event");
      console.error("Error updating event:", err);
    }
  };

  if (loading) {
    return <div>Memuat data event...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
