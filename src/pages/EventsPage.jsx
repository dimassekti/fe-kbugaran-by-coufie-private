import React from "react";
import EventList from "../components/EventList";
import { getEvents, deleteEvent } from "../utils/api";
// For testing with local data: import { getAllEvents, deleteEvent, getEventsByCategory } from "../utils/local-data-archive";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`event-tabpanel-${index}`}
    aria-labelledby={`event-tab-${index}`}
    {...other}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      category: "",
      isLoading: true,
      error: null,
      tabValue: 0,
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

      let events = result.data || [];

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
    const { events, category, isLoading, error, tabValue } = this.state;

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
              Daftar Event
            </Typography>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => this.setState({ tabValue: newValue })}
              aria-label="event management tabs">
              <Tab label="Daftar Event" />
              <Tab label="Tambah Event" />
            </Tabs>
          </Box>

          {/* Tab 0: Event List */}
          <TabPanel
            value={tabValue}
            index={0}>
            <Box sx={{ mb: 3, maxWidth: 300 }}>
              <FormControl fullWidth>
                <InputLabel id="category-filter-label">
                  Filter Kategori
                </InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={category}
                  label="Filter Kategori"
                  onChange={this.handleCategoryChange}>
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="Seminar">Seminar</MenuItem>
                  <MenuItem value="Workshop">Workshop</MenuItem>
                  <MenuItem value="Kompetisi">Kompetisi</MenuItem>
                  <MenuItem value="Konferensi">Konferensi</MenuItem>
                  <MenuItem value="Pelatihan">Pelatihan</MenuItem>
                  <MenuItem value="Webinar">Webinar</MenuItem>
                  <MenuItem value="Lainnya">Lainnya</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <EventList
              events={events}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
            />
          </TabPanel>

          {/* Tab 1: Add Event */}
          <TabPanel
            value={tabValue}
            index={1}>
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ mb: 2 }}>
                Tambah Event Baru
              </Typography>
              <Fab
                color="primary"
                aria-label="add"
                sx={{ mt: 2 }}
                onClick={() => this.props.navigate("/events/add")}>
                <AddIcon />
              </Fab>
              <Typography
                variant="body2"
                sx={{ mt: 2 }}>
                Klik tombol di atas untuk menambah event baru.
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
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
