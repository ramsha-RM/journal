import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
        <Route path="/dashboard" element={
          localStorage.getItem('pin_verified') === 'true' ? <Dashboard />
        : <Navigate to="/pin/verify"/>} />
        <Route path="/journals" element={<MyJournals />} />
        <Route path="/create" element={<CreateJournal />} />

        <Route path="/profile" element={<Profile />} />

        <Route path='*' element={<Navigate to="/" />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
