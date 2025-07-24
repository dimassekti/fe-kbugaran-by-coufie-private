import React from "react";
import PropTypes from "prop-types";
import NoteItemDetail from "./NoteItemDetail";
import NoteDeleteButton from "./NoteDeleteButton";

function NoteItem({ id, title, createdAt, body, onDelete }) {
  return (
    <div className="note-item">
      <NoteItemDetail
      id={id}
        title={title}
        createdAt={createdAt}
        body={body}
      />
      <NoteDeleteButton
        id={id}
        onDelete={onDelete}
      />
    </div>
  );
}

NoteItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteItem;
