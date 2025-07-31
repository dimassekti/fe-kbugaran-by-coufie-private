import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

function HospitalDetail({
  hospital,
  staffCount,
  onEdit,
  onDelete,
  onBack,
  onAddStaff,
  error,
}) {
  if (!hospital) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <CardContent>
          <Alert
            severity="error"
            sx={{ mb: 2 }}>
            Rumah sakit tidak ditemukan.
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
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
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
          <Typography variant="h5">{hospital.name || "-"}</Typography>
          <Chip
            label={hospital.type === "hospital" ? "Rumah Sakit" : "Klinik"}
            color="primary"
          />
        </Stack>
        <Typography
          variant="body1"
          sx={{ mb: 2 }}>
          {hospital.description || "-"}
        </Typography>
        <Typography variant="body2">
          Alamat: {hospital.address || "-"}
        </Typography>
        <Typography variant="body2">
          Telepon: {hospital.phone || "-"}
        </Typography>
        {hospital.email && (
          <Typography variant="body2">Email: {hospital.email}</Typography>
        )}
        <Typography variant="body2">
          Jumlah Staff: {staffCount !== undefined ? staffCount : "-"}
        </Typography>
        <Typography variant="body2">
          Status: {hospital.isActive ? "Aktif" : "Tidak Aktif"}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={onEdit}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}>
            Hapus
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={onAddStaff}>
            Tambah Staff
          </Button>
          <Button
            variant="outlined"
            onClick={onBack}>
            Kembali
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

HospitalDetail.propTypes = {
  hospital: PropTypes.object,
  staffCount: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBack: PropTypes.func,
  onAddStaff: PropTypes.func,
  error: PropTypes.string,
};

export default HospitalDetail;
