import React from "react";  
import PropTypes from "prop-types"; 

function NoteDeleteButton({ id, onDelete }) {
  return (
    <button className="note-item__delete-button" onClick={() => onDelete(id)}>
      X
    </button>
  );
}

NoteDeleteButton.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteDeleteButton;  