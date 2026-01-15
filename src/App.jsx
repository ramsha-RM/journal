import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup  from './pages/Signup'  
import Verification from './pages/Verification'
import Login from './pages/Login'
import Createpin  from './pages/Createpin'
import Verifypin from './pages/Verifypin'
import Dashboard from './pages/Dashboard'
import Changepassword from './password/Changepassword'
import Forgotpassword from './password/Forgotpassword'
import Resetpassword from './password/Resetpassword'

function App() {
    
  return (
<BrowserRouter>
    <Routes>
      <Route path="/" element = {<Signup />} />
      <Route path="/verification" element = {<Verification />} />
      <Route path="/login" element = {<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/reset-password/:token" element={<Resetpassword />} />
      <Route path='/Changepassword' element = {<Changepassword />} />
      <Route path='/Createpin' element = {<Createpin />} />
      <Route path='/Verifypin' element = {<Verifypin />} />
      <Route path='/dashboard' element = {<Dashboard />} />
      </Routes>
</BrowserRouter>
  )}

export default App
