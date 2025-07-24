import React from "react";
import NoteList from "../components/NoteList";
import { deleteNote } from "../utils/api";
import { getActiveNotes } from "../utils/api";
import PropTypes from "prop-types";

class NotesHomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      keyword: props.defaultKeyword || "",
    };

    this.onDeleteHandler = this.onDeleteHandler.bind(this);
  }

  async componentDidMount() {
    const { data } = await getActiveNotes();

    this.setState(() => {
      return {
        notes: data,
      };
    });
  }

  async onDeleteHandler(id) {
    await deleteNote(id);

    const { data } = await getActiveNotes();
    this.setState(() => {
      return {
        notes: data,
      };
    });
  }

  render() {
    return (
      <section>
        <h2>Daftar Catatan</h2>
        <NoteList
          notes={this.state.notes}
          onDelete={this.onDeleteHandler}
        />
      </section>
    );
  }
}

NotesHomePage.propTypes = {
  defaultKeyword: PropTypes.string,
};

export default NotesHomePage;
