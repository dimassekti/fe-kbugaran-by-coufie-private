import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function ParticipantTable({ participants }) {
  const navigate = useNavigate();

  const columns = [
    { field: "name", headerName: "Nama", flex: 1 },
    { field: "dob", headerName: "Tanggal Lahir", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Telepon", flex: 1 },
    { field: "registrationDate", headerName: "Tanggal Registrasi", flex: 1 },
    { field: "checkUpStatus", headerName: "Status Check-up", flex: 1 },
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
        rows={participants}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        disableSelectionOnClick
        autoHeight
        sx={{ backgroundColor: "white" }}
      />
    </Box>
  );
}

ParticipantTable.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default ParticipantTable;
