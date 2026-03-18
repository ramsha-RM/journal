import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verification from './pages/auth/Verification';
import Forgotpassword from './pages/security/ForgotPassword';
import Resetpassword from './pages/security/ResetPassword';
import Changepassword from './pages/security/Changepassword';
import CreatePin from './pages/auth/CreatePin';
import VerifyPin from './pages/auth/VerifyPin';

import Dashboard from './pages/journal/Dashboard';
import Profile from './pages/settings/Profile';
import MyJournals from './pages/journal/MyJournals';
import CreateJournal from './pages/journal/CreateJournal';
import AddJournal from './pages/journal/AddJournal';


const ProtectRoute = () => {
  const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";
  const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY ||"login_token";

  const accessToken = localStorage.getItem(ACCESS_KEY);
  const loginToken = localStorage.getItem(LOGIN_KEY);

  // console.log("ProtectRoute - Access:", accessToken);
  // console.log("ProtectRoute - Login:", loginToken);

  if (!accessToken && !loginToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Auth Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/password/forgot" element={<Forgotpassword />} />
        <Route path="/password/reset" element={<Resetpassword />} />

        {/* --- PIN Routes --- */}
        {/* Inhein ProtectRoute se bahar rakha hai taake user inhein access kar sakay */}
        <Route path="/pin/create" element={<CreatePin />} />
        <Route path="/pin/verify" element={<VerifyPin />} />

        {/* ---  Dashboard Routes --- */}
        <Route element={<ProtectRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journals" element={<MyJournals />} />
          <Route path="/create" element={<CreateJournal />} />
          <Route path="/create/:id" element={<CreateJournal />} />
          <Route path="/journal/:id" element={<AddJournal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/password/change" element={<Changepassword />} />
        </Route>

    
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;