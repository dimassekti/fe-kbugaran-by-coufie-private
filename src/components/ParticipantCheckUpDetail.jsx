import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddIcon from "@mui/icons-material/Add";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ParticipantCheckUpDetail({
  checkUpDetails,
  checkUpHistory,
  medicalData,
  noDataMessage,
  onEdit,
  onExport,
  onFillCheckup,
}) {
  // Show no data message if no medical data exists at all
  if (!medicalData && noDataMessage) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <CardContent>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", py: 2 }}>
            {noDataMessage}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onFillCheckup}
              sx={{ mr: 1 }}>
              Isi Checkup
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // If we have medical data but no checkUpDetails, show a different message
  if (medicalData && !checkUpDetails) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
        <CardContent>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", py: 2 }}>
            Data checkup tersedia tapi tidak ada detail yang dapat ditampilkan.
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}>
              Edit Checkup
            </Button>
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={onExport}>
              Export PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Original fallback
  if (!checkUpDetails) return <div>Belum ada data check-up.</div>;
  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{ mb: 2 }}>
          Check-up Terbaru
        </Typography>
        <Typography variant="body2">
          Tanggal:{" "}
          {formatDate(
            checkUpDetails.checkup_date || checkUpDetails.checkUpDate
          )}
        </Typography>
        <Typography variant="body2">
          Diperiksa oleh:{" "}
          {checkUpDetails.checked_by || checkUpDetails.doctorName || "-"}
        </Typography>
        <Typography variant="body2">
          Tekanan Darah: {checkUpDetails.blood_pressure_systolic || "-"}/
          {checkUpDetails.blood_pressure_diastolic || "-"} mmHg
        </Typography>
        <Typography variant="body2">
          Detak Jantung:{" "}
          {checkUpDetails.heart_rate || checkUpDetails.heartRate || "-"} bpm
        </Typography>
        <Typography variant="body2">
          Berat Badan: {checkUpDetails.weight || "-"} kg
        </Typography>
        <Typography variant="body2">
          Tinggi Badan: {checkUpDetails.height || "-"} cm
        </Typography>
        <Typography variant="body2">
          Kondisi Medis:{" "}
          {checkUpDetails.medical_conditions || checkUpDetails.allergies || "-"}
        </Typography>
        <Typography variant="body2">
          Obat-obatan: {checkUpDetails.medications || "-"}
        </Typography>
        <Typography variant="body2">
          Level Kebugaran:{" "}
          {checkUpDetails.fitness_level || checkUpDetails.fitnessLevel || "-"}
        </Typography>
        <Typography variant="body2">
          Status Persetujuan:{" "}
          {checkUpDetails.is_approved ? "Disetujui" : "Belum Disetujui"}
        </Typography>
        <Typography variant="body2">
          Catatan:{" "}
          {checkUpDetails.approval_notes || checkUpDetails.notes || "-"}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onEdit}
            size="small">
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={onExport}
            size="small">
            Export PDF
          </Button>
        </Box>

        {checkUpHistory && checkUpHistory.length > 0 && (
          <Stack sx={{ mt: 3 }}>
            <Typography variant="subtitle1">
              Riwayat Check-up Sebelumnya:
            </Typography>
            {checkUpHistory.map((item, idx) => (
              <Card
                key={idx}
                sx={{ my: 1, backgroundColor: "#f5f5f5" }}>
                <CardContent>
                  <Typography variant="body2">
                    Tanggal: {formatDate(item.checkUpDate)}
                  </Typography>
                  <Typography variant="body2">
                    Dokter: {item.doctorName}
                  </Typography>
                  <Typography variant="body2">
                    Tekanan Darah: {item.bloodPressure}
                  </Typography>
                  <Typography variant="body2">
                    Suhu: {item.temperature}°C
                  </Typography>
                  <Typography variant="body2">
                    Detak Jantung: {item.heartRate} bpm
                  </Typography>
                  <Typography variant="body2">
                    Berat Badan: {item.weight} kg
                  </Typography>
                  <Typography variant="body2">
                    Alergi: {item.allergies}
                  </Typography>
                  <Typography variant="body2">
                    Obat: {item.medications}
                  </Typography>
                  <Typography variant="body2">Catatan: {item.notes}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

ParticipantCheckUpDetail.propTypes = {
  checkUpDetails: PropTypes.object,
  checkUpHistory: PropTypes.array,
  medicalData: PropTypes.object,
  noDataMessage: PropTypes.string,
  onEdit: PropTypes.func,
  onExport: PropTypes.func,
  onFillCheckup: PropTypes.func,
};

export default ParticipantCheckUpDetail;
