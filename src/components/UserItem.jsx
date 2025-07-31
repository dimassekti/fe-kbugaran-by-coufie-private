import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

function UserItem({ user, onDelete, onEdit }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "staff":
        return "primary";
      case "member":
        return "default";
      default:
        return "default";
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "staff":
        return "Staff";
      case "member":
        return "Member";
      default:
        return role;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{user.fullname}</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          Username: {user.username}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          Role:
          <Chip
            label={formatRole(user.role)}
            color={getRoleColor(user.role)}
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => onEdit && onEdit(user.id)}
          disabled={!onEdit}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete && onDelete(user.id)}
          disabled={!onDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default UserItem;
