import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventDetail({
  event,
  participantCount,
  medicalStaffCount,
  onEdit,
  onDelete,
  onBack,
  onAddParticipant,
  onAddMedicalStaff,
  error,
}) {
  const navigate = useNavigate();

  if (!event) {
    return (
      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "100%", md: "100%" },
          mx: "auto",
          mt: 3,
        }}>
        <CardContent>
          <Alert
            severity="error"
            sx={{ mb: 2 }}>
            Event tidak ditemukan.
          </Alert>
          <Button
            variant="outlined"
            onClick={onBack}>
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "100%", md: "100%" },
        mx: "auto",
        mt: 3,
        boxShadow: 2,
      }}>
      <CardContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}>
          <Typography variant="h5">{event.name || "-"}</Typography>
          <Chip
            label={event.category || "-"}
            color="primary"
          />
        </Stack>
        <Typography
          variant="body1"
          sx={{ mb: 2 }}>
          {event.description || "-"}
        </Typography>
        <Typography variant="body2">
          Tanggal: {formatDate(event.date)}
        </Typography>
        <Typography variant="body2">Lokasi: {event.location || "-"}</Typography>
        <Typography variant="body2">
          Penyelenggara: {event.organizer || "-"}
        </Typography>
        <Typography variant="body2">
          Participants:{" "}
          {participantCount !== undefined ? participantCount : "-"}/
          {event.capacity !== undefined && event.capacity !== null
            ? event.capacity
            : "-"}
        </Typography>
        <Typography variant="body2">
          Medical Staff:{" "}
          {medicalStaffCount !== undefined ? medicalStaffCount : "-"}
        </Typography>
        <Typography variant="body2">
          Status: {event.status || "Aktif"}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 3,
            flexWrap: "wrap",
            gap: 1,
            "& .MuiButton-root": {
              minWidth: "120px",
              minHeight: "36px",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: "6px",
              textTransform: "none",
              px: 2,
              py: 1,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              },
            },
          }}>
          <Button
            variant="contained"
            onClick={onEdit}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}>
            EDIT
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            sx={{
              "&:hover": { backgroundColor: "#c62828" },
            }}>
            HAPUS
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onAddParticipant}
            sx={{
              "&:hover": { backgroundColor: "#2e7d32" },
            }}>
            TAMBAH PESERTA
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={onAddMedicalStaff}
            sx={{
              "&:hover": { backgroundColor: "#0277bd" },
            }}>
            TAMBAH MEDICAL STAFF
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#f5f5f5",
                borderWidth: "2px",
              },
            }}>
            KEMBALI
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

EventDetail.propTypes = {
  event: PropTypes.object,
  participantCount: PropTypes.number,
  medicalStaffCount: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBack: PropTypes.func,
  onAddParticipant: PropTypes.func,
  onAddMedicalStaff: PropTypes.func,
  error: PropTypes.string,
};

export default EventDetail;
