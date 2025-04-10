import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
