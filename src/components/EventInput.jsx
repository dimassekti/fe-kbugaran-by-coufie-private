import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const categories = ["Seminar", "Workshop", "Kompetisi", "Meetup", "Webinar"];

class EventInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.event?.name || "",
      description: props.event?.description || "",
      date: props.event?.date || "",
      location: props.event?.location || "",
      organizer: props.event?.organizer || "",
      capacity: props.event?.capacity || "",
      category: props.event?.category || "",
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (
      !this.state.name ||
      !this.state.description ||
      !this.state.date ||
      !this.state.location ||
      !this.state.organizer ||
      !this.state.capacity ||
      !this.state.category
    ) {
      alert("Semua field harus diisi!");
      return;
    }
    this.props.onSubmit({ ...this.state });
  };

  render() {
    return (
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 3 }}>
        <CardContent>
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Nama Event"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Deskripsi"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tanggal"
              name="date"
              type="date"
              value={this.state.date}
              onChange={this.handleChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Lokasi"
              name="location"
              value={this.state.location}
              onChange={this.handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Penyelenggara"
              name="organizer"
              value={this.state.organizer}
              onChange={this.handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Kapasitas"
              name="capacity"
              type="number"
              value={this.state.capacity}
              onChange={this.handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl
              fullWidth
              sx={{ mb: 2 }}>
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={this.state.category}
                label="Kategori"
                onChange={this.handleChange}>
                {categories.map((cat) => (
                  <MenuItem
                    key={cat}
                    value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth>
              {this.props.editing ? "Update Event" : "Tambah Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
}

EventInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  event: PropTypes.object,
  editing: PropTypes.bool,
};

export default EventInput;
