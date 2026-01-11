import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Signup  from './pages/signup'  
import Verification from './pages/verification'
import Login from './pages/login'
import Createpin  from './pages/Createpin'
import Verifypin from './pages/Verifypin'
import Dashboard from './pages/dashboard'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
<BrowserRouter>
    <Routes>
      <Route path="/" element = {<Signup />} />
      <Route path="/login" element = {<Login />} />
      <Route path="/verify-account" element = {<Verification />} />
      <Route path='/create-pin' element = {<Createpin />} />
      <Route path='/verify-pin' element = {<Verifypin />} />
      <Route path='/dashboard' element = {<Dashboard />} />
      </Routes>
</BrowserRouter>
  )}

export default App
