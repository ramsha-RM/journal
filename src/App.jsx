import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useHeartbeat from './hooks/useHeartbeat';
import { useAuthLock } from './hooks/useAuthLock';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Verification from './pages/auth/Verification';
import CreatePin from './pages/auth/CreatePin';
import VerifyPin from './pages/auth/VerifyPin';

import Forgotpassword from './pages/security/ForgotPassword';
import Resetpassword from './pages/security/ResetPassword';
import Changepassword from './pages/security/Changepassword';
import Profile from './pages/settings/Profile';
import Setting from './pages/settings/Setting';
import AppLock from './pages/auth/AppLock';

import Dashboard from './pages/journal/Dashboard';
import MyJournals from './pages/journal/MyJournals';
import CreateJournal from './pages/journal/CreateJournal';
import AddJournal from './pages/journal/AddJournal';


const ProtectRoute = () => {
  const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || "access_token";
  const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || "login_token";

  const accessToken = localStorage.getItem(ACCESS_KEY);
  const loginToken = localStorage.getItem(LOGIN_KEY);

  const isAuthenticated = !!(accessToken || loginToken);

  useHeartbeat(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


const AppLockGuard = () => {
  const lockPreference = localStorage.getItem("app_lock") || "off";

  useAuthLock(lockPreference);

  return <Outlet />;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/password/forgot" element={<Forgotpassword />} />
        <Route path="/password/reset" element={<Resetpassword />} />

        <Route path="/pin/create" element={<CreatePin />} />
        <Route path="/pin/verify" element={<VerifyPin />} />

        <Route element={<ProtectRoute />}>
          <Route element={<AppLockGuard />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journals" element={<MyJournals />} />
            <Route path="/create" element={<CreateJournal />} />
            <Route path="/create/:id" element={<CreateJournal />} />
            <Route path="/journal/:id" element={<AddJournal />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/password/change" element={<Changepassword />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/appLock" element={<AppLock />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;