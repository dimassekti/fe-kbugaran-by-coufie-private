import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";

function EventMedicalStaffTable({ medicalStaff, onEdit, onDelete }) {
  if (!medicalStaff || medicalStaff.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2 }}>
          Medical Staff Event
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}>
          Belum ada medical staff yang ditugaskan
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Medical Staff Event ({medicalStaff.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="event medical staff table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama Staff</TableCell>
              <TableCell>Rumah Sakit</TableCell>
              <TableCell>Role Staff</TableCell>
              <TableCell>Spesialisasi</TableCell>
              <TableCell>Assignment Role</TableCell>
              <TableCell>Tanggal Ditugaskan</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicalStaff.map((staff, index) => (
              <TableRow
                key={staff.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell
                  component="th"
                  scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {staff.staffName || staff.user?.username || "-"}
                </TableCell>
                <TableCell>{staff.hospitalName || "-"}</TableCell>
                <TableCell>
                  {staff.staffRole === "doctor" ? "Dokter" : "Perawat"}
                </TableCell>
                <TableCell>{staff.specialization || "-"}</TableCell>
                <TableCell>{staff.assignmentRole || "-"}</TableCell>
                <TableCell>
                  {staff.assignedAt
                    ? new Date(staff.assignedAt).toLocaleDateString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit && onEdit(staff.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete && onDelete(staff.id)}>
                      Hapus
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

EventMedicalStaffTable.propTypes = {
  medicalStaff: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default EventMedicalStaffTable;
