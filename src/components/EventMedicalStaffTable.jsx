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
  const medicalStaffWithNumbers = medicalStaff.map((staff, index) => {
    // Debug: log data structure to understand the backend response
    console.log("Medical Staff Data Full Object:", staff);
    console.log("License Number Field:", staff.license_number);
    console.log("Years of Experience Field:", staff.years_of_experience);
    console.log("Specialization Field:", staff.specialization);
    console.log("Staff Role Field:", staff.staff_role);

    // Map role dari staff_role dengan fallback ke assignment_role
    let role = "Staff";
    if (staff.staff_role) {
      switch (staff.staff_role) {
        case "doctor":
          role = "Dokter";
          break;
        case "nurse":
          role = "Perawat";
          break;
        case "specialist":
          role = "Spesialis";
          break;
        case "technician":
          role = "Teknisi";
          break;
        default:
          role = staff.staff_role;
      }
    } else if (staff.assignment_role) {
      role = staff.assignment_role;
    }

    return {
      ...staff,
      id: staff.id || staff.user_id || `staff-${index}`, // Ensure unique ID
      number: index + 1,
      // Nama dari username atau fullname
      username: staff.username || staff.fullname || "Tidak ditentukan",
      // Role yang sudah di-map
      role: role,
      // Date fields
      registration_date: staff.assigned_date || staff.created_at || null,
      status: staff.assignment_role || "Medical Staff",

      // Fields langsung dari backend response
      hospitalName: staff.hospital_name || "Tidak ditentukan",
      specialization: staff.specialization || "Tidak ditentukan",
      licenseNumber: staff.license_number || "Tidak ditentukan",
      experience: staff.years_of_experience
        ? typeof staff.years_of_experience === "number" &&
          staff.years_of_experience > 0
          ? `${staff.years_of_experience} tahun`
          : "Tidak ditentukan"
        : "Tidak ditentukan",
    };
  });

  const columns = [
    { field: "number", headerName: "No", width: 70 },
    { field: "username", headerName: "Nama", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "specialization",
      headerName: "Spesialisasi",
      flex: 1,
      valueFormatter: (params) => {
        if (!params || !params.value || params.value === "-")
          return "Tidak ditentukan";
        return params.value;
      },
    },
    {
      field: "licenseNumber",
      headerName: "No. Lisensi",
      flex: 1,
      valueFormatter: (params) => {
        if (!params || !params.value || params.value === "-")
          return "Tidak ditentukan";
        return params.value;
      },
    },
    {
      field: "experience",
      headerName: "Pengalaman",
      flex: 1,
      valueFormatter: (params) => {
        if (
          !params ||
          !params.value ||
          params.value === "-" ||
          params.value === "Tidak ditentukan"
        ) {
          return "Tidak ditentukan";
        }
        // If it's a number, format it properly
        if (
          typeof params.value === "number" ||
          !isNaN(parseInt(params.value))
        ) {
          const years = parseInt(params.value);
          return years > 0 ? `${years} tahun` : "Tidak ditentukan";
        }
        return params.value;
      },
    },
    {
      field: "registration_date",
      headerName: "Tanggal Bergabung",
      flex: 1,
      valueFormatter: (params) => {
        if (!params || !params.value) return "-";
        try {
          return new Date(params.value).toLocaleDateString("id-ID");
        } catch (error) {
          return "-";
        }
      },
    },
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
      <Box sx={{ height: 400, width: "100%", minWidth: 300 }}>
        <DataGrid
          rows={medicalStaffWithNumbers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id || `row-${Math.random()}`}
          disableSelectionOnClick
          autoHeight
          sx={{
            backgroundColor: "white",
            minHeight: 200,
            width: "100%",
          }}
          localeText={{
            noRowsLabel: "Belum ada medical staff yang ditugaskan",
          }}
          onError={(error) => {
            console.error("DataGrid error:", error);
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
