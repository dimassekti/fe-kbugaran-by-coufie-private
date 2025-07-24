import React from "react";
import EventList from "../components/EventList";
import { getEvents, deleteEvent } from "../utils/api";
// For testing with local data: import { getAllEvents, deleteEvent, getEventsByCategory } from "../utils/local-data-archive";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      category: "",
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents = async () => {
    this.setState({ isLoading: true, error: null });

    try {
      const result = await getEvents();

      if (result.error) {
        this.setState({
          error: result.message || "Gagal memuat event",
          isLoading: false,
        });
        return;
      }

      let events = result.data.events || [];

      // Filter by category if selected
      if (this.state.category) {
        events = events.filter(
          (event) => event.category === this.state.category
        );
      }

      this.setState({
        events,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        error: "Terjadi kesalahan yang tidak terduga",
        isLoading: false,
      });
      console.error("Error loading events:", err);
    }
  };

  handleDelete = async (id) => {
    try {
      const result = await deleteEvent(id);

      if (result.error) {
        alert(result.message || "Gagal menghapus event");
        return;
      }

      // Reload events after successful deletion
      this.loadEvents();
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus event");
      console.error("Error deleting event:", err);
    }
  };

  handleEdit = (id) => {
    this.props.navigate(`/events/${id}/edit`);
  };

  handleCategoryChange = (e) => {
    this.setState({ category: e.target.value }, this.loadEvents);
  };

  render() {
    const { events, category, isLoading, error } = this.state;

    if (isLoading) {
      return (
        <section className="events-page">
          <h2>Daftar Event</h2>
          <p>Memuat event...</p>
        </section>
      );
    }

    if (error) {
      return (
        <section className="events-page">
          <h2>Daftar Event</h2>
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}>
            {error}
          </div>
          <button onClick={this.loadEvents}>Coba Lagi</button>
        </section>
      );
    }

    return (
      <section className="events-page">
        <h2>Daftar Event</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="category">Filter Kategori: </label>
          <select
            id="category"
            value={category}
            onChange={this.handleCategoryChange}>
            <option value="">Semua</option>
            <option value="Seminar">Seminar</option>
            <option value="Workshop">Workshop</option>
            <option value="Kompetisi">Kompetisi</option>
            <option value="Konferensi">Konferensi</option>
            <option value="Pelatihan">Pelatihan</option>
            <option value="Webinar">Webinar</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <EventList
          events={events}
          onDelete={this.handleDelete}
          onEdit={this.handleEdit}
        />
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 32, right: 32 }}
          onClick={() => this.props.navigate("/events/add")}>
          {" "}
          <AddIcon />{" "}
        </Fab>
      </section>
    );
  }
}

function EventsPageWrapper(props) {
  const navigate = useNavigate();
  return (
    <EventsPage
      {...props}
      navigate={navigate}
    />
  );
}

export default EventsPageWrapper;
