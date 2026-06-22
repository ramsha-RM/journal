import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const adminPassKey = localStorage.getItem("adminPassKey");

  if (!isAdmin || !adminPassKey) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;