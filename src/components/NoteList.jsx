import React from "react";
import PropTypes from "prop-types";
import NoteItem from "./NoteItem";

function NoteList({ notes, onDelete }) {
  if (notes.length === 0) {
    return <p className="notes-list__empty-message">Tidak ada catatan</p>;
  }
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          {...note}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteList;
