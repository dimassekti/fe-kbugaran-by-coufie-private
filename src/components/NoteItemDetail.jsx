import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function NoteItemDetail({ id, title, createdAt, body }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          gutterBottom>
          <MuiLink
            component={RouterLink}
            to={`/notes/${id}`}
            underline="hover">
            {title}
          </MuiLink>
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom>
          {createdAt}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary">
          {body}
        </Typography>
      </CardContent>
    </Card>
  );
}

NoteItemDetail.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default NoteItemDetail;
