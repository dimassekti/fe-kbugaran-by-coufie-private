import React, { useState } from "react";
import { addHospital } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ErrorAlert from "../components/ErrorAlert";

function AddHospitalPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nama hospital wajib diisi");
      return false;
    }
    if (!formData.type) {
      setError("Tipe hospital wajib diisi");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Alamat hospital wajib diisi");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Nomor telepon wajib diisi");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email wajib diisi");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    // Basic phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Format nomor telepon tidak valid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await addHospital(formData);

      if (result.error) {
        setError(result.message || "Gagal menambahkan rumah sakit");
        return;
      }

      // Success
      setSuccessMessage("Hospital berhasil ditambahkan!");
      setTimeout(() => {
        navigate("/hospitals");
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga");
      console.error("Error adding hospital:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage("");
  };

  return (
    <section className="add-hospital-page">
      <h2>Tambah Rumah Sakit Baru</h2>

      <Card sx={{ maxWidth: 500, mx: "auto", mt: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nama Rumah Sakit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={error && error.includes("Nama")}
              sx={{ mb: 2 }}
            />
            <FormControl
              fullWidth
              required
              error={error && error.includes("Tipe")}
              sx={{ mb: 2 }}>
              <InputLabel id="type-label">Jenis</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={formData.type}
                label="Jenis"
                onChange={handleChange}>
                <MenuItem value="hospital">Rumah Sakit</MenuItem>
                <MenuItem value="clinic">Klinik</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Alamat"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              required
              error={error && error.includes("Alamat")}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Telepon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              error={error && error.includes("telepon")}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={error && error.includes("Email")}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}>
              {isLoading ? "Menambahkan..." : "Tambah Rumah Sakit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ErrorAlert
        open={!!error}
        message={error || ""}
        severity="error"
        onClose={handleCloseError}
      />

      <ErrorAlert
        open={!!successMessage}
        message={successMessage}
        severity="success"
        onClose={handleCloseSuccess}
      />
    </section>
  );
}

export default AddHospitalPage;
