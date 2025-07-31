import React from "react";
import HospitalList from "../components/HospitalList";
import { getHospitals, deleteHospital } from "../utils/api";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";

class HospitalsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitals: [],
      type: "",
      isLoading: true,
      error: null,
      successMessage: "",
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

  render() {
    const { hospitals, type, isLoading, error, successMessage } = this.state;

    if (isLoading) {
      return (
        <section className="hospitals-page">
          <h2>Hospital List</h2>
          <p>Loading hospitals...</p>
        </section>
      );
    }

    return (
      <section className="hospitals-page">
        <h2>Hospital List</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="type">Filter by Type: </label>
          <select
            id="type"
            value={type}
            onChange={this.handleTypeChange}>
            <option value="">All</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
          </select>
        </div>
        <HospitalList
          hospitals={Array.isArray(hospitals) ? hospitals : []}
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}
        />
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          onClick={() => this.props.navigate("/hospitals/add")}>
          <AddIcon />
        </Fab>

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
      </section>
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
