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

function HospitalStaffTable({ staff, onEdit, onDelete }) {
  if (!staff || staff.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 2 }}>
          Staff Rumah Sakit
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 3 }}>
          Belum ada staff yang terdaftar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Staff Rumah Sakit ({staff.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="hospital staff table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Spesialisasi</TableCell>
              <TableCell>No. Lisensi</TableCell>
              <TableCell>Pengalaman (Tahun)</TableCell>
              <TableCell>Tanggal Bergabung</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((staffMember, index) => (
              <TableRow
                key={staffMember.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell
                  component="th"
                  scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {staffMember.username || staffMember.user?.username || "-"}
                </TableCell>
                <TableCell>
                  {staffMember.staffRole === "doctor" ? "Dokter" : "Perawat"}
                </TableCell>
                <TableCell>{staffMember.specialization || "-"}</TableCell>
                <TableCell>{staffMember.licenseNumber || "-"}</TableCell>
                <TableCell>{staffMember.yearsOfExperience || "-"}</TableCell>
                <TableCell>
                  {staffMember.assignedAt
                    ? new Date(staffMember.assignedAt).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit && onEdit(staffMember.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete && onDelete(staffMember.id)}>
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

HospitalStaffTable.propTypes = {
  staff: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default HospitalStaffTable;
