import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function truncate(text, maxLength) {
  return text && text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text || "";
}

function HospitalItem({ hospital, onDelete, onEdit }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{hospital.name}</Typography>
        <Typography
          variant="body2"
          color="text.secondary">
          {truncate(hospital.description, 100)}
        </Typography>
        <Typography variant="body2">
          Jenis: {hospital.type === "hospital" ? "Rumah Sakit" : "Klinik"}
        </Typography>
        <Typography variant="body2">Alamat: {hospital.address}</Typography>
        <Typography variant="body2">Telepon: {hospital.phone}</Typography>
        {hospital.email && (
          <Typography variant="body2">Email: {hospital.email}</Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/hospitals/${hospital.id}`)}>
          Detail
        </Button>
        <Button
          size="small"
          onClick={() => onEdit && onEdit(hospital.id)}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete && onDelete(hospital.id)}>
          Hapus
        </Button>
      </CardActions>
    </Card>
  );
}

HospitalItem.propTypes = {
  hospital: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default HospitalItem;
