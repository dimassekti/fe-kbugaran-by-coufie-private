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
import useInput from "../hooks/useInput";

const roles = ["staff", "member"];

function UserInput({ onAddUser, isLoading }) {
  const [username, onUsernameChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [fullname, onFullnameChange] = useInput("");
  const [role, setRole] = React.useState("");

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation
    if (!username.trim() || !password.trim() || !fullname.trim() || !role) {
      alert("All fields are required");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Call the parent function with user data
    onAddUser({
      username: username.trim(),
      password: password.trim(),
      fullname: fullname.trim(),
      role: role,
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={onUsernameChange}
            margin="normal"
            required
            disabled={isLoading}
            placeholder="Enter unique username"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            margin="normal"
            required
            disabled={isLoading}
            placeholder="Enter password (min 6 characters)"
          />

          <TextField
            fullWidth
            label="Full Name"
            value={fullname}
            onChange={onFullnameChange}
            margin="normal"
            required
            disabled={isLoading}
            placeholder="Enter full name"
          />

          <FormControl
            fullWidth
            margin="normal"
            required>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={handleRoleChange}
              label="Role"
              disabled={isLoading}>
              {roles.map((roleOption) => (
                <MenuItem
                  key={roleOption}
                  value={roleOption}>
                  {roleOption === "staff" ? "Staff" : "Member"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
            fullWidth>
            {isLoading ? "Adding User..." : "Add User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

UserInput.propTypes = {
  onAddUser: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

UserInput.defaultProps = {
  isLoading: false,
};

export default UserInput;
