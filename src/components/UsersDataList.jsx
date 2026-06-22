import React from "react";
import { MdOutlineEdit } from "react-icons/md";
const UserDataList = ({
  users = [],
  searchTerm = "",
  entriesCount = 10,
  onEdit,
  onDelete,
}) => {
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.userId.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const displayedUsers = filteredUsers.slice(0, entriesCount);

  return (
    <div className="table-responsive">
      <table className="students-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>User ID</th>
            <th>Name </th>
            <th>Role </th>
            <th>Mobile </th>
            <th>Email </th>
            <th>Joined Date </th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.profileImg}
                    alt={user.name}
                    className="profile-avatar"
                  />
                </td>

                <td className="bold-text">{user.userId}</td>
                <td className="text-muted">{user.name}</td>
                <td className="text-muted">{user.role}</td>
                <td className="bold-text">{user.mobile}</td>
                <td className="text-muted">{user.email}</td>
                <td className="text-muted">{user.joinedDate}</td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit?.(user.id)}
                    >
                      <MdOutlineEdit />
                    </button>

                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete?.(user.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "24px",
                  color: "#a0aec0",
                }}
              >
                No matching user records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDataList;