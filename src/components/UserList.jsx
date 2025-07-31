import React from "react";
import PropTypes from "prop-types";
import UserItem from "./UserItem";

function UserList({ users, onDelete, onEdit, deleteDisabled = true }) {
  if (!users || !Array.isArray(users) || users.length === 0) {
    return <p>No users available.</p>;
  }
  return (
    <div className="user-list">
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onDelete={onDelete}
          onEdit={onEdit}
          deleteDisabled={deleteDisabled}
        />
      ))}
    </div>
  );
}

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  deleteDisabled: PropTypes.bool,
};

export default UserList;
