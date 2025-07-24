import React from "react";
import NoteList from "../components/NoteList";
import { getAllNotes, deleteNote } from "../utils/local-data";

class HomePage extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      notes: getAllNotes()
    }

    this.onDeleteHandler = this.onDeleteHandler.bind(this);
  }

  onDeleteHandler(id){
    deleteNote(id);

    this.setState(() => {
      return {
        notes: getAllNotes(),
      }
    });
  }

  render(){
    return(
      <section>
        <h2>Daftar Catatan</h2>
        <NoteList notes={this.state.notes} onDelete={this.onDeleteHandler} />
      </section>
    )
  }
}

export default HomePage;