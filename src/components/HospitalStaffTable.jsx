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
          sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
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

  const formatExperience = (years) => {
    if (!years || years === 0) return "Tidak ditentukan";
    return `${years} tahun`;
  };

  const formatLicenseNumber = (license) => {
    if (!license) return "Tidak ditentukan";
    return license;
  };

  const formatJoinDate = (date) => {
    if (!date) return "Tidak ditentukan";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}>
        Staff Rumah Sakit ({staff.length})
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: 2 }}>
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableHead-root": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiTableCell-head": {
              fontWeight: 600,
              color: "text.primary",
            },
            "& .MuiTableCell-body": {
              color: "text.primary",
            },
          }}
          aria-label="hospital staff table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>No</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nama</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Spesialisasi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>No. Lisensi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Pengalaman</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tanggal Bergabung</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((staffMember, index) => (
              <TableRow
                key={staffMember.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ fontWeight: 500 }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>
                  {staffMember.username ||
                    staffMember.user?.username ||
                    "Tidak diketahui"}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {staffMember.staffRole === "doctor" ? "Dokter" : "Perawat"}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {staffMember.specialization || "Tidak ditentukan"}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {formatLicenseNumber(staffMember.licenseNumber)}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {formatExperience(staffMember.yearsOfExperience)}
                </TableCell>
                <TableCell sx={{ color: "text.primary" }}>
                  {formatJoinDate(staffMember.assignedAt)}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit && onEdit(staffMember.id)}
                      sx={{ minWidth: "60px" }}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete && onDelete(staffMember.id)}
                      sx={{ minWidth: "60px" }}>
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
