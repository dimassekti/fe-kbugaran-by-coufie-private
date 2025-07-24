import React from "react";
import { useParams } from "react-router-dom";
import { getNote } from "../utils/api";
import NoteDetail from "../components/NoteDetail";
import PropTypes from "prop-types";

function DetailPageWrapper() {
  const { id } = useParams();
  return <DetailPage id={id} />;
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: null,
      loading: true,
    };
  }

  async componentDidMount() {
    const { data } = await getNote(this.props.id);
    this.setState({
      note: data,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <div>Memuat detail catatan...</div>;
    }
    if (!this.state.note) {
      return <div>Catatan tidak ditemukan.</div>;
    }
    return (
      <NoteDetail
        title={this.state.note.title}
        createdAt={this.state.note.createdAt}
        body={this.state.note.body}
      />
    );
  }
}

DetailPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DetailPageWrapper;
