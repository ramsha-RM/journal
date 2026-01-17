import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup  from './pages/Signup'  
import Verification from './pages/Verification'
import Login from './pages/Login'
import Forgotpassword from './password/Forgotpassword'
import Resetpassword from './password/Resetpassword'
import Createpin  from './pages/Createpin'
import Verifypin from './pages/Verifypin'
import Dashboard from './journal/Dashboard'
import Changepassword from './password/Changepassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/login" element={<Login />} />

        {/* Password Routes */}
        <Route path="/password/forgot" element={<Forgotpassword />} />
        <Route path="/password/reset" element={<Resetpassword />} />
        <Route path="/password/change" element={<Changepassword />} />

        {/* PIN Routes */}
        <Route path="/pin/create" element={<Createpin />} />
        <Route path="/pin/verify" element={<Verifypin />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
