import React from "react";
import UserList from "../components/UserList";
import UserInput from "../components/UserInput";
import {
  getAllUsers,
  addUserByAdmin,
  deleteUser,
  updateUser,
} from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";

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
      editDialogOpen: false,
      editingUser: null,
      editFormData: { username: "", fullname: "", role: "" },
      editLoading: false,
      deleteDialogOpen: false,
      deletingUserId: null,
      deleteLoading: false,
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
    this.setState({
      deleteDialogOpen: true,
      deletingUserId: id,
    });
  };

  confirmDelete = async () => {
    const { deletingUserId } = this.state;
    this.setState({ deleteLoading: true });

    try {
      const result = await deleteUser(deletingUserId);

      if (result.error) {
        // Handle disabled delete feature gracefully
        alert("User deletion is currently disabled for safety reasons.");
      } else {
        // If deletion was successful, reload users
        await this.loadUsers();
        alert("User deleted successfully!");
      }
    } catch (error) {
      alert("Failed to delete user. The feature may be disabled.");
    } finally {
      this.setState({
        deleteDialogOpen: false,
        deletingUserId: null,
        deleteLoading: false,
      });
    }
  };

  handleEdit = (id) => {
    const user = this.state.users.find((u) => u.id === id);
    if (user) {
      this.setState({
        editDialogOpen: true,
        editingUser: user,
        editFormData: {
          username: user.username || "",
          fullname: user.fullname || "",
          role: user.role || "",
        },
      });
    }
  };

  handleEditFormChange = (field) => (event) => {
    this.setState({
      editFormData: {
        ...this.state.editFormData,
        [field]: event.target.value,
      },
    });
  };

  submitEditUser = async () => {
    const { editingUser, editFormData } = this.state;
    this.setState({ editLoading: true });

    try {
      const result = await updateUser(editingUser.id, {
        username: editFormData.username.trim(),
        fullname: editFormData.fullname.trim(),
        role: editFormData.role.trim(),
      });

      if (result.error) {
        alert("Failed to update user: " + result.message);
      } else {
        await this.loadUsers();
        alert("User updated successfully!");
        this.setState({ editDialogOpen: false, editingUser: null });
      }
    } catch (error) {
      alert("Failed to update user. Please try again.");
    } finally {
      this.setState({ editLoading: false });
    }
  };

  closeEditDialog = () => {
    this.setState({
      editDialogOpen: false,
      editingUser: null,
      editFormData: { username: "", fullname: "", role: "" },
    });
  };

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
      deletingUserId: null,
    });
  };

  render() {
    const { users, isLoading, error, tabValue, addUserLoading, addUserError } =
      this.state;

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
              User Management
            </Typography>
          </Box>

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
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="30vh">
                <Box textAlign="center">
                  <CircularProgress size={60} />
                  <Typography
                    variant="h6"
                    sx={{ mt: 2 }}
                    color="text.primary">
                    Loading users...
                  </Typography>
                </Box>
              </Box>
            ) : error ? (
              <Box
                textAlign="center"
                sx={{ py: 4 }}>
                <Typography
                  color="error"
                  variant="h6"
                  gutterBottom>
                  Error: {error}
                </Typography>
                <button onClick={this.loadUsers}>Retry</button>
              </Box>
            ) : (
              <UserList
                users={users}
                onDelete={this.handleDelete}
                onEdit={this.handleEdit}
                deleteDisabled={true}
              />
            )}
          </TabPanel>

          <TabPanel
            value={tabValue}
            index={1}>
            {addUserError && (
              <Typography
                color="error"
                variant="body1"
                sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
                {addUserError}
              </Typography>
            )}
            <UserInput
              onAddUser={this.onAddUserHandler}
              isLoading={addUserLoading}
            />
          </TabPanel>
        </Paper>

        {/* Edit User Dialog */}
        <Dialog
          open={this.state.editDialogOpen}
          onClose={this.closeEditDialog}
          maxWidth="sm"
          fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Username"
                value={this.state.editFormData.username}
                onChange={this.handleEditFormChange("username")}
                fullWidth
                disabled={this.state.editLoading}
              />
              <TextField
                label="Full Name"
                value={this.state.editFormData.fullname}
                onChange={this.handleEditFormChange("fullname")}
                fullWidth
                disabled={this.state.editLoading}
              />
              <TextField
                label="Role"
                value={this.state.editFormData.role}
                onChange={this.handleEditFormChange("role")}
                fullWidth
                disabled={this.state.editLoading}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeEditDialog}
              disabled={this.state.editLoading}>
              Cancel
            </Button>
            <Button
              onClick={this.submitEditUser}
              variant="contained"
              disabled={this.state.editLoading}>
              {this.state.editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={this.closeDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </Typography>
            <Alert
              severity="warning"
              sx={{ mt: 2 }}>
              Note: User deletion may be disabled for safety reasons.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.closeDeleteDialog}
              disabled={this.state.deleteLoading}>
              Cancel
            </Button>
            <Button
              onClick={this.confirmDelete}
              color="error"
              variant="contained"
              disabled={this.state.deleteLoading}>
              {this.state.deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
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
