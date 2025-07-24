import React, { useState } from "react";
import EventInput from "../components/EventInput";
import { addEvent } from "../utils/api";
// For testing with local data: import { addEvent } from "../utils/local-data-archive";
import { useNavigate } from "react-router-dom";

function AddEventPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onAddEventHandler = async (eventData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await addEvent(eventData);

      if (result.error) {
        setError(result.message || "Gagal menambahkan event");
        return;
      }

      // Success - navigate to events page
      navigate("/events");
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
      console.error("Error adding event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="add-event-page">
      <h2>Tambah Event Baru</h2>
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      <EventInput
        onSubmit={onAddEventHandler}
        isLoading={isLoading}
      />
    </section>
  );
}

export default AddEventPage;
