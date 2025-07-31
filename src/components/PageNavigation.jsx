import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Home as HomeIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  People as UsersIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

function PageNavigation({ logout, name, userRole }) {
  console.log("PageNavigation props:", { logout, name, userRole });

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link
            to="/"
            className="nav-link">
            <HomeIcon sx={{ fontSize: 20, marginRight: 1 }} />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="nav-link">
            <InfoIcon sx={{ fontSize: 20, marginRight: 1 }} />
            About
          </Link>
        </li>
        {logout && (
          <>
            <li>
              <Link
                to="/hospitals"
                className="nav-link">
                <HospitalIcon sx={{ fontSize: 20, marginRight: 1 }} />
                Hospitals
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="nav-link">
                <EventIcon sx={{ fontSize: 20, marginRight: 1 }} />
                Events
              </Link>
            </li>
            {userRole === "admin" && (
              <li>
                <Link
                  to="/users"
                  className="nav-link">
                  <UsersIcon sx={{ fontSize: 20, marginRight: 1 }} />
                  Users
                </Link>
              </li>
            )}
            <li>
              <span className="username-display">
                <PersonIcon sx={{ fontSize: 18, marginRight: 0.5 }} />
                {name || "User"}
              </span>
            </li>
            <li>
              <button
                onClick={logout}
                className="logout-button"
                title="Logout">
                <LogoutIcon sx={{ fontSize: 20 }} />
              </button>
            </li>
          </>
        )}
        {!logout && (
          <li>
            <Link
              to="/login"
              className="nav-link">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

PageNavigation.propTypes = {
  logout: PropTypes.func,
  name: PropTypes.string,
  userRole: PropTypes.string,
};

export default PageNavigation;
