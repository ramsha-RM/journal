import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Toast from "../../components/Toast";
import UserDataList from "../../components/UsersDataList";
import { fetchUsers, deleteUser } from "../../service/admin.service";
import "../../style/AdminPgStyle/Userdata.css";
import SeaarchIcon from "../../assets/icons/searchicon.png";

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries] = useState(10);
  const [loading, setLoading] = useState(false);

  const [toast] = useState({
    show: false,
    message: "",
    type: "",
  });

const adminPassKey = localStorage.getItem("adminPassKey");

// if (!adminPassKey) {
//   return <Navigate to="/admin/login" replace />;
// }

 const getUsers = async () => {
  const adminPassKey = localStorage.getItem("adminPassKey");

  if (!adminPassKey) {
    console.error("Admin key not found");
    return;
  }

  try {
    setLoading(true);

    const { data } = await fetchUsers({
      adminPassKey,
      page: 1,
      limit: entries,
    });

    setUsers(data.data || []);

  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error.response?.data || error
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getUsers();
  }, []);

  const handleEdit = (id) => {

  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, adminPassKey);

      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="userData">
      <Sidebar />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      <main className="main-userdata">
        <header className="top-header">
          <div className="welcome-section">
            <h1>Welcome to Notevia!</h1>
            <p>Manage your users and their data efficiently.</p>
          </div>

          <div className="search">
            <img
              src={SeaarchIcon}
              alt="search"
              className="search-icon"
            />

            <input
              type="text"
              className="adminpanel-search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </header>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <UserDataList
            users={users}
            searchTerm={searchTerm}
            entriesCount={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
};

export default UserData;