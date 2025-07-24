import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ParticipantCheckUpDetail({ checkUpDetails, checkUpHistory }) {
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
          Tanggal: {formatDate(checkUpDetails.checkUpDate)}
        </Typography>
        <Typography variant="body2">
          Dokter: {checkUpDetails.doctorName}
        </Typography>
        <Typography variant="body2">
          Tekanan Darah: {checkUpDetails.bloodPressure}
        </Typography>
        <Typography variant="body2">
          Suhu: {checkUpDetails.temperature}°C
        </Typography>
        <Typography variant="body2">
          Detak Jantung: {checkUpDetails.heartRate} bpm
        </Typography>
        <Typography variant="body2">
          Berat Badan: {checkUpDetails.weight} kg
        </Typography>
        <Typography variant="body2">
          Alergi: {checkUpDetails.allergies}
        </Typography>
        <Typography variant="body2">
          Obat: {checkUpDetails.medications}
        </Typography>
        <Typography variant="body2">Catatan: {checkUpDetails.notes}</Typography>
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
};

export default ParticipantCheckUpDetail;
