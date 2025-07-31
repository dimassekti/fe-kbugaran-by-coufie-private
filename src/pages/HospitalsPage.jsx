import React from "react";
import HospitalList from "../components/HospitalList";
import { getHospitals, deleteHospital, addHospital } from "../utils/api";
import {
  Fab,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`hospital-tabpanel-${index}`}
    aria-labelledby={`hospital-tab-${index}`}
    {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

class HospitalsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitals: [],
      type: "",
      isLoading: true,
      error: null,
      successMessage: "",
      tabValue: 0,
      addMethod: "navigate", // "navigate" or "inline"
      isSubmitting: false,
      formData: {
        name: "",
        type: "",
        address: "",
        phone: "",
        email: "",
        description: "",
      },
    };
  }

  componentDidMount() {
    this.loadHospitals();
  }

  loadHospitals = async () => {
    this.setState({ isLoading: true, error: null });

    try {
      const result = await getHospitals();

      if (result.error) {
        this.setState({
          error: result.message || "Failed to load hospitals",
          hospitals: [], // Ensure hospitals is always an array
          isLoading: false,
        });
        return;
      }

      // Ensure we have an array of hospitals
      let hospitals = Array.isArray(result.data) ? result.data : [];

      // Filter by type if selected
      if (this.state.type) {
        hospitals = hospitals.filter(
          (hospital) => hospital.type === this.state.type
        );
      }

      this.setState({
        hospitals,
        isLoading: false,
        error: null, // Clear any previous errors
      });
    } catch (err) {
      this.setState({
        error: "An unexpected error occurred while loading hospitals",
        hospitals: [], // Ensure hospitals is always an array
        isLoading: false,
      });
      console.error("Error loading hospitals:", err);
    }
  };

  handleDelete = async (id) => {
    try {
      const result = await deleteHospital(id);

      if (result.error) {
        this.setState({
          error: result.message || "Failed to delete hospital",
        });
        return;
      }

      // Show success message and reload hospitals
      this.setState({
        successMessage: "Hospital deleted successfully!",
        error: null, // Clear any previous errors
      });
      this.loadHospitals();
    } catch (err) {
      this.setState({
        error: "An unexpected error occurred while deleting hospital",
      });
      console.error("Error deleting hospital:", err);
    }
  };

  handleEdit = (id) => {
    this.props.navigate(`/hospitals/${id}/edit`);
  };

  handleTypeChange = (e) => {
    this.setState({ type: e.target.value }, this.loadHospitals);
  };

  handleCloseError = () => {
    this.setState({ error: null });
  };

  handleCloseSuccess = () => {
    this.setState({ successMessage: "" });
  };

  handleFormChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value },
      error: null, // Clear error when user starts typing
    }));
  };

  validateForm = () => {
    const { formData } = this.state;

    if (!formData.name.trim()) {
      this.setState({ error: "Nama hospital wajib diisi" });
      return false;
    }
    if (!formData.type) {
      this.setState({ error: "Tipe hospital wajib diisi" });
      return false;
    }
    if (!formData.address.trim()) {
      this.setState({ error: "Alamat hospital wajib diisi" });
      return false;
    }
    if (!formData.phone.trim()) {
      this.setState({ error: "Nomor telepon wajib diisi" });
      return false;
    }
    if (!formData.email.trim()) {
      this.setState({ error: "Email wajib diisi" });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      this.setState({ error: "Format email tidak valid" });
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      this.setState({ error: "Format nomor telepon tidak valid" });
      return false;
    }

    return true;
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    try {
      const result = await addHospital(this.state.formData);

      if (result.error) {
        this.setState({
          error: result.message || "Gagal menambahkan rumah sakit",
          isSubmitting: false,
        });
        return;
      }

      // Success
      this.setState({
        successMessage: "Hospital berhasil ditambahkan!",
        isSubmitting: false,
        formData: {
          name: "",
          type: "",
          address: "",
          phone: "",
          email: "",
          description: "",
        },
      });

      // Reload hospitals and switch back to list tab
      this.loadHospitals();
      setTimeout(() => {
        this.setState({ tabValue: 0 });
      }, 1500);
    } catch (err) {
      this.setState({
        error: "Terjadi kesalahan yang tidak terduga",
        isSubmitting: false,
      });
      console.error("Error adding hospital:", err);
    }
  };

  render() {
    const {
      hospitals,
      type,
      isLoading,
      error,
      successMessage,
      tabValue,
      addMethod,
      isSubmitting,
      formData,
    } = this.state;

    if (isLoading) {
      return (
        <Container
          maxWidth="lg"
          sx={{ py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh">
            <Box textAlign="center">
              <CircularProgress size={60} />
              <Typography
                variant="h6"
                sx={{ mt: 2 }}
                color="text.primary">
                Loading hospitals...
              </Typography>
            </Box>
          </Box>
        </Container>
      );
    }

    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{ overflow: "hidden" }}>
          <Box sx={{ p: 4, borderBottom: 1, borderColor: "divider" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              color="primary"
              fontWeight="600">
              Hospital Management
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => this.setState({ tabValue: newValue })}
              aria-label="hospital management tabs">
              <Tab label="Daftar Hospital" />
              <Tab label="Tambah Hospital" />
            </Tabs>
          </Box>

          {/* Tab 0: Hospital List */}
          <TabPanel
            value={tabValue}
            index={0}>
            <Box sx={{ mb: 3, maxWidth: 300 }}>
              <FormControl fullWidth>
                <InputLabel id="type-filter-label">Filter by Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  value={type}
                  label="Filter by Type"
                  onChange={this.handleTypeChange}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="hospital">Hospital</MenuItem>
                  <MenuItem value="clinic">Clinic</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <HospitalList
              hospitals={Array.isArray(hospitals) ? hospitals : []}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
            />
          </TabPanel>

          {/* Tab 1: Add Hospital */}
          <TabPanel
            value={tabValue}
            index={1}>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ mb: 3, textAlign: "center" }}>
                Tambah Hospital Baru
              </Typography>

              {/* Method Selection */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2 }}>
                  Pilih cara menambah hospital:
                </Typography>
                <ToggleButtonGroup
                  value={addMethod}
                  exclusive
                  onChange={(e, newMethod) => {
                    if (newMethod !== null) {
                      this.setState({ addMethod: newMethod });
                    }
                  }}
                  aria-label="add method selection">
                  <ToggleButton
                    value="navigate"
                    aria-label="navigate to page">
                    Halaman Terpisah
                  </ToggleButton>
                  <ToggleButton
                    value="inline"
                    aria-label="inline form">
                    Form di Tab Ini
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Navigate to Add Page Option */}
              {addMethod === "navigate" && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Fab
                    color="primary"
                    aria-label="add"
                    sx={{ mb: 2 }}
                    onClick={() => this.props.navigate("/hospitals/add")}>
                    <AddIcon />
                  </Fab>
                  <Typography variant="body2">
                    Klik tombol di atas untuk membuka halaman add hospital
                    terpisah
                  </Typography>
                </Box>
              )}

              {/* Inline Form Option */}
              {addMethod === "inline" && (
                <Card sx={{ maxWidth: 600, mx: "auto" }}>
                  <CardContent>
                    <form onSubmit={this.handleFormSubmit}>
                      <TextField
                        label="Nama Rumah Sakit"
                        name="name"
                        value={formData.name}
                        onChange={this.handleFormChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <FormControl
                        fullWidth
                        required
                        sx={{ mb: 2 }}>
                        <InputLabel id="form-type-label">Jenis</InputLabel>
                        <Select
                          labelId="form-type-label"
                          name="type"
                          value={formData.type}
                          label="Jenis"
                          onChange={this.handleFormChange}>
                          <MenuItem value="hospital">Rumah Sakit</MenuItem>
                          <MenuItem value="clinic">Klinik</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Alamat"
                        name="address"
                        value={formData.address}
                        onChange={this.handleFormChange}
                        multiline
                        rows={2}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Telepon"
                        name="phone"
                        value={formData.phone}
                        onChange={this.handleFormChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={this.handleFormChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Deskripsi"
                        name="description"
                        value={formData.description}
                        onChange={this.handleFormChange}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ mb: 3 }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting}>
                        {isSubmitting ? "Menambahkan..." : "Tambah Rumah Sakit"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </Box>
          </TabPanel>
        </Paper>

        <ErrorAlert
          open={!!error}
          message={error || ""}
          severity="error"
          onClose={this.handleCloseError}
        />

        <ErrorAlert
          open={!!successMessage}
          message={successMessage}
          severity="success"
          onClose={this.handleCloseSuccess}
        />
      </Container>
    );
  }
}

function HospitalsPageWrapper(props) {
  const navigate = useNavigate();
  return (
    <HospitalsPage
      {...props}
      navigate={navigate}
    />
  );
}

export default HospitalsPageWrapper;
