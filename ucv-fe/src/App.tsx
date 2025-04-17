import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import OurTours from './pages/OurTours'
import TourDetails from './pages/TourDetails'
import SignUpForm from './pages/SignUpForm'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-tours" element={<OurTours />} />
        <Route path="/tour-details" element={<TourDetails />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
