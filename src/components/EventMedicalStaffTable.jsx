import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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

  // Add number column based on assignment order and map to match participant table structure
  const medicalStaffWithNumbers = medicalStaff.map((staff, index) => ({
    ...staff,
    number: index + 1,
    username: staff.staffName || staff.user?.username || "-",
    role: staff.staffRole === "doctor" ? "Dokter" : "Perawat",
    registration_date: staff.assignedAt,
    status: staff.assignmentRole || "Medical Staff",
  }));

  const columns = [
    { field: "number", headerName: "No", width: 70 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "registration_date",
      headerName: "Tanggal Registrasi",
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        return new Date(params.value).toLocaleDateString("id-ID");
      },
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Aksi",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit && onEdit(params.row.id)}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete && onDelete(params.row.id)}>
            Hapus
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}>
        Medical Staff Event ({medicalStaff.length})
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={medicalStaffWithNumbers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
          disableSelectionOnClick
          autoHeight
          sx={{ backgroundColor: "white" }}
          localeText={{
            noRowsLabel: "Belum ada medical staff yang ditugaskan",
          }}
        />
      </Box>
    </Box>
  );
}

EventMedicalStaffTable.propTypes = {
  medicalStaff: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default EventMedicalStaffTable;
