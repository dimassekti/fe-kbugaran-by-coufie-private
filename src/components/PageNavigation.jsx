import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FiHome, FiPlus, FiLogOut } from "react-icons/fi";

function PageNavigation({ logout, name }) {
  console.log("PageNavigation props:", { logout, name });

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add">Add</Link>
        </li>
        <li>
          <Link to="/events">Event</Link>
        </li>
        <li>
          <Link to="/events/add">Tambah Event</Link>
        </li>
        {logout && (
          <li>
            <button
              onClick={logout}
              style={{ color: "white" }}>
              {name || "User"} <FiLogOut />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

PageNavigation.propTypes = {
  logout: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default PageNavigation;
