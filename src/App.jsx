import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Signup  from './pages/signup'  
import Verification from './pages/verification'
import Login from './pages/login'
// import Dashboard from './pages/dashboard'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
<BrowserRouter>
    <Routes>
      <Route path="/" element = {<Signup />} />
      <Route path="/" element = {<Login />} />
      <Route path="/" element = {<Verification />} />
      </Routes>
</BrowserRouter>
  )}

export default App
