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
      (user.full_name || "").toLowerCase().includes(searchLower) ||
      String(user.user_id || "")
        .toLowerCase()
        .includes(searchLower)
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
            <th>Name</th>
            <th>Joined Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <img
                    src={user.profile_picture || "/default-avatar.png"}
                    alt={user.full_name || "User"}
                    className="profile-avatar"
                  />
                </td>

                <td className="bold-text">{user.user_id}</td>

                <td className="text-muted">{user.full_name || "-"}</td>

                <td className="text-muted">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <div className="action-buttons">
                    {/* <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit?.(user.id)}
                    >
                      <MdOutlineEdit />
                    </button> */}

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
                colSpan="5"
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
