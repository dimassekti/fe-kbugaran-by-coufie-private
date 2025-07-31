import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getHospitalById,
  deleteHospital,
  getHospitalStaff,
  addHospitalStaff,
  updateHospitalStaff,
  deleteHospitalStaff,
  getAllUsers,
  getUserByUsername,
} from "../utils/api";
import HospitalDetail from "../components/HospitalDetail";
import HospitalStaffTable from "../components/HospitalStaffTable";
import AddHospitalStaffDialog from "../components/AddHospitalStaffDialog";
import { Snackbar, Alert, Box } from "@mui/material";

function HospitalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [staff, setStaff] = useState([]);
  const [staffCount, setStaffCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [addingStaff, setAddingStaff] = useState(false);

  // Separate error states following validation pattern
  const [dialogError, setDialogError] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchHospitalData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch hospital details
        const hospitalResponse = await getHospitalById(id);
        if (hospitalResponse.error) {
          setError(hospitalResponse.message);
          setHospital(null);
        } else {
          const hospitalData =
            hospitalResponse.data?.hospital || hospitalResponse.data;
          setHospital(hospitalData);
        }

        // Fetch hospital staff
        const staffResponse = await getHospitalStaff(id);
        if (staffResponse.error) {
          console.warn("Failed to fetch staff:", staffResponse.message);
          setStaff([]);
          setStaffCount(0);
        } else {
          const staffData = staffResponse.data || [];
          setStaff(staffData);
          setStaffCount(staffData.length);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data rumah sakit");
        console.error("Error fetching hospital data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [id]);

  const handleDelete = async () => {
    const response = await deleteHospital(id);
    if (!response.error) {
      navigate("/hospitals");
    } else {
      setError("Gagal menghapus rumah sakit: " + response.message);
    }
  };

  const handleEdit = () => {
    navigate(`/hospitals/${id}/edit`);
  };

  const handleBack = () => {
    navigate("/hospitals");
  };

  const handleAddStaff = async () => {
    setShowAddDialog(true);
    // Try to fetch users for staff dropdown
    try {
      const usersResponse = await getAllUsers();
      if (!usersResponse.error) {
        setUsers(usersResponse.data);
      }
    } catch (err) {
      console.warn("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    setUsers([]);
    // Clear dialog-specific errors when closing dialogs
    setDialogError(null);
  };

  const handleSubmitStaff = async (staffData) => {
    setAddingStaff(true);
    // Clear dialog errors at the start of form submission
    setDialogError(null);

    try {
      // Validate user existence
      const userResponse = await getUserByUsername(staffData.username);

      if (userResponse.error) {
        if (userResponse.message.includes("tidak ditemukan")) {
          setDialogError("Username not found in the system");
        } else {
          setDialogError("Failed to find user: " + userResponse.message);
        }
        return;
      }

      const userId = userResponse.data.id;

      // Add hospital staff
      const response = await addHospitalStaff(id, {
        userId,
        staffRole: staffData.staffRole,
        specialization: staffData.specialization,
        licenseNumber: staffData.licenseNumber,
        yearsOfExperience: staffData.yearsOfExperience,
      });

      if (response.error) {
        if (response.message.includes("sudah terdaftar")) {
          setDialogError(
            "This user is already a staff member in this hospital"
          );
        } else {
          setDialogError("Failed to add staff: " + response.message);
        }
        return;
      }

      // Success handling
      setSuccessMessage("Staff added successfully!");
      setShowAddDialog(false);
      setUsers([]);
      setDialogError(null);

      // Refresh staff data
      const staffResponse = await getHospitalStaff(id);
      if (!staffResponse.error) {
        const staffData = staffResponse.data || [];
        setStaff(staffData);
        setStaffCount(staffData.length);
      }
    } catch (err) {
      setDialogError("Terjadi kesalahan yang tidak terduga");
      console.error("Error adding staff:", err);
    } finally {
      setAddingStaff(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const response = await deleteHospitalStaff(staffId);
      if (response.error) {
        setError("Gagal menghapus staff: " + response.message);
        return;
      }

      setSuccessMessage("Staff deleted successfully!");

      // Refresh staff data
      const staffResponse = await getHospitalStaff(id);
      if (!staffResponse.error) {
        const staffData = staffResponse.data || [];
        setStaff(staffData);
        setStaffCount(staffData.length);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus staff");
      console.error("Error deleting staff:", err);
    }
  };

  const handleEditStaff = (staffId) => {
    // For now, just show an alert. In a full implementation,
    // this would open an edit dialog similar to the add dialog
    alert("Edit functionality not implemented yet");
  };

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
        <p>Memuat detail rumah sakit...</p>
      </div>
    );
  }

  if (error && !hospital) {
    return (
      <div>
        <h2>Error</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate("/hospitals")}>
          Kembali ke Daftar Rumah Sakit
        </button>
      </div>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "#ffebee",
            border: "1px solid #e57373",
            borderRadius: "4px",
          }}>
          {error}
        </div>
      )}

      <HospitalDetail
        hospital={hospital}
        staffCount={staffCount}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={handleBack}
        onAddStaff={handleAddStaff}
      />

      <HospitalStaffTable
        staff={staff}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
      />

      <AddHospitalStaffDialog
        open={showAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleSubmitStaff}
        users={users}
        loading={addingStaff}
        error={dialogError}
        staff={staff}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HospitalDetailPage;
