import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";


function showFormattedDate(date) {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NoteDetail({ title, createdAt, body }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography color="text.secondary">{createdAt}</Typography>
        <Typography>{body}</Typography>
      </CardContent>
    </Card>
  );
}

NoteDetail.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default NoteDetail;
