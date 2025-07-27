import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent, getEventParticipants } from "../utils/api";
import EventDetail from "../components/EventDetail";

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // USEEFFECT TEKNIK-MU1
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch event details
        const eventResponse = await getEventById(id);
        if (eventResponse.error) {
          setError(eventResponse.message);
          setEvent(null);
        } else {
          // Support both { data: { event: {...} } } and { data: {...} }
          const eventData = eventResponse.data?.event || eventResponse.data;
          setEvent(eventData);
        }

        // Fetch participants count
        const participantsResponse = await getEventParticipants(id);
        if (participantsResponse.error) {
          console.warn(
            "Failed to fetch participants:",
            participantsResponse.message
          );
          setParticipantCount(0);
        } else {
          setParticipantCount(participantsResponse.data.length);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data event");
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleDelete = async () => {
    const response = await deleteEvent(id);
    if (!response.error) {
      navigate("/events");
    } else {
      setError("Gagal menghapus event: " + response.message);
    }
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <EventDetail
      event={event}
      participantCount={participantCount}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
      error={error}
    />
  );
}

export default EventDetailPage;
