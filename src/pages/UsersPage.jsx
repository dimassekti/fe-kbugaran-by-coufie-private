import React from "react";
import UserList from "../components/UserList";
import UserInput from "../components/UserInput";
import { getAllUsers, addUserByAdmin } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Typography } from "@mui/material";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true,
      error: null,
      tabValue: 0,
      addUserLoading: false,
      addUserError: null,
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    this.setState({ isLoading: true, error: null });

    try {
      const result = await getAllUsers();

      if (result.error) {
        this.setState({
          error: result.message || "Failed to load users",
          isLoading: false,
        });
        return;
      }

      const users = result.data?.users || result.data || [];

      this.setState({
        users,
        isLoading: false,
      });
    } catch (err) {
      this.setState({
        error: "An unexpected error occurred",
        isLoading: false,
      });
      console.error("Error loading users:", err);
    }
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  onAddUserHandler = async (userData) => {
    this.setState({ addUserLoading: true, addUserError: null });

    try {
      const result = await addUserByAdmin(userData);

      if (result.error) {
        this.setState({
          addUserError: result.message || "Failed to add user",
          addUserLoading: false,
        });
        return;
      }

      // Success - switch to Users tab and refresh the list
      this.setState({
        tabValue: 0,
        addUserLoading: false,
        addUserError: null,
      });
      this.loadUsers();
    } catch (err) {
      this.setState({
        addUserError: "An unexpected error occurred",
        addUserLoading: false,
      });
      console.error("Error adding user:", err);
    }
  };

  handleDelete = async (id) => {
    // Delete functionality can be added later
    console.log("Delete user:", id);
  };

  handleEdit = (id) => {
    // Edit functionality can be added later
    console.log("Edit user:", id);
  };

  render() {
    const { users, isLoading, error, tabValue, addUserLoading, addUserError } =
      this.state;

    return (
      <section className="users-page">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom>
          User Management
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={this.handleTabChange}
            aria-label="user management tabs">
            <Tab label="Users" />
            <Tab label="Tambah User" />
          </Tabs>
        </Box>

        <TabPanel
          value={tabValue}
          index={0}>
          {isLoading ? (
            <Typography>Loading users...</Typography>
          ) : error ? (
            <Box>
              <Typography color="error">Error: {error}</Typography>
              <button onClick={this.loadUsers}>Retry</button>
            </Box>
          ) : (
            <UserList
              users={users}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
            />
          )}
        </TabPanel>

        <TabPanel
          value={tabValue}
          index={1}>
          {addUserError && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "1rem" }}>
              {addUserError}
            </div>
          )}
          <UserInput
            onAddUser={this.onAddUserHandler}
            isLoading={addUserLoading}
          />
        </TabPanel>
      </section>
    );
  }
}

function UsersPageWrapper(props) {
  const navigate = useNavigate();
  return (
    <UsersPage
      {...props}
      navigate={navigate}
    />
  );
}

export default UsersPageWrapper;
