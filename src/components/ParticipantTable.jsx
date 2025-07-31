import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function ParticipantTable({ participants, emptyMessage }) {
  const navigate = useNavigate();

  // Add number column based on registration order
  const participantsWithNumbers = participants.map((participant, index) => ({
    ...participant,
    number: index + 1,
    // Determine checkup status based on participant checkup data
    checkupStatus:
      participant.participantCheckups &&
      participant.participantCheckups.length > 0
        ? "completed"
        : "pending",
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
      field: "checkupStatus",
      headerName: "Status Checkup",
      flex: 1,
      renderCell: (params) => {
        const hasCheckup = params.row.checkupStatus === "completed";
        return (
          <span
            style={{
              color: hasCheckup ? "#4caf50" : "#f44336",
              fontWeight: 600,
            }}>
            {hasCheckup ? "Selesai" : "Belum"}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/participants/${params.row.id}`)}>
          Detail
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%", mt: 2 }}>
      <DataGrid
        rows={participantsWithNumbers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        autoHeight
        sx={{ backgroundColor: "white" }}
        localeText={{
          noRowsLabel: emptyMessage || "No participants available",
        }}
      />
    </Box>
  );
}

ParticipantTable.propTypes = {
  participants: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
};

export default ParticipantTable;
