import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, getParticipantsByEvent } from "../utils/local-data";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function ParticipantListPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    setEvent(getEvent(id));
    setParticipants(getParticipantsByEvent(id));
  }, [id]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "registrationDate", headerName: "Registration Date", flex: 1 },
    { field: "checkUpStatus", headerName: "Check-Up Status", flex: 1 },
  ];

  if (!event) {
    return <div>Event tidak ditemukan.</div>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2 }}>
        Participants for: {event.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2 }}>
        Capacity: {event.capacity} | Total Participants: {participants.length}
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={participants.map((p) => ({ ...p, id: p.id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={(params) => {
            window.location.href = `/participants/${params.row.id}`;
          }}
          sx={{ cursor: "pointer" }}
        />
      </div>
    </Box>
  );
}

export default ParticipantListPage;
