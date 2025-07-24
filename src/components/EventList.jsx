import React from "react";
import PropTypes from "prop-types";
import EventItem from "./EventItem";

function EventList({ events, onDelete, onEdit }) {
  if (!events || events.length === 0) {
    return <p>Tidak ada event yang tersedia.</p>;
  }
  return (
    <div className="event-list">
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

EventList.propTypes = {
  events: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default EventList;
