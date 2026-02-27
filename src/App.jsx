import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register  from './pages/auth/Register'  
import Verification from './pages/auth/Verification'

import Forgotpassword from './pages/security/ForgotPassword'
import Resetpassword from './pages/security/ResetPassword'

import CreatePin  from './pages/auth/CreatePin'
import VerifyPin from './pages/auth/VerifyPin'

import Dashboard from './pages/journal/Dashboard'
import Changepassword from './pages/security/Changepassword'

import Profile from './pages/settings/Profile'
import MyJournals from './pages/journal/MyJournals'
import CreateJournal from './pages/journal/CreateJournal'
import AddJournal from './pages/journal/AddJournal'

const ProtectRoute = ({ isAuth }) => {
  const hasLoginToken = localStorage.getItem('login_token');
  const hasAccessToken = localStorage.getItem('access_token');
  const isAuthenticated = !!localStorage.getItem('login_token') || !!localStorage.getItem('access_token');
if(!isAuthenticated) return <Navigate to="/" />;
  
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification" element={<Verification />} />

        {/* Password Routes */}
        <Route path="/password/forgot" element={<Forgotpassword />} />
        <Route path="/password/reset" element={<Resetpassword />} />
        <Route path="/password/change" element={<Changepassword />} />

        {/* PIN Routes */}
        <Route path="/pin/create" element={<CreatePin />} />
        <Route path="/pin/verify" element={<VerifyPin />} />

        {/* Dashboard */}
        <Route element={<ProtectRoute isAuth={true} />}>   
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journals" element={<MyJournals />} />
        <Route path="/create" element={<CreateJournal />} />
        <Route path="/create/:id" element={<CreateJournal />} />
        <Route path="/journal/:id" element={<AddJournal />} />
        <Route path="/profile" element={<Profile />} />
        </Route> 

        <Route path='*' element={<Navigate to="/" />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
