import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


class NoteInput extends React.Component {

  constructor(props){
    super(props);

    // init state
    this.state = {
      title: '',
      body: '',
      createdAt: '',
      archived: false,
    };

    this.onTitleChangeHandler = this.onTitleChangeHandler.bind(this);
    this.onBodyChangeHandler = this.onBodyChangeHandler.bind(this); 
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  onTitleChangeHandler(event) {
    this.setState(() => {
      return {
        title: event.target.value,
      };
    });
  }

  onBodyChangeHandler(event) {
    this.setState(() => {
      return {
        body: event.target.value,
      };
    });
  } 

  onSubmitHandler(event) {
    event.preventDefault();
    this.props.addContact(this.state);
  }
  render() {
    return (
      <Card sx={{ maxWidth: 600, margin: "40px auto" }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Tambah Catatan
          </Typography>
          <form className="note-input" onSubmit={this.onSubmitHandler}>
            <TextField
              label="Judul"
              variant="outlined"
              fullWidth
              margin="normal"
              value={this.state.title}
              onChange={this.onTitleChangeHandler}
            />
            <TextField
              label="Tuliskan catatanmu di sini..."
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              minRows={4}
              value={this.state.body}
              onChange={this.onBodyChangeHandler}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              fullWidth
            >
              Buat
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
}

NoteInput.propTypes = {
  addContact: PropTypes.func.isRequired,
};

export default NoteInput;