import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import OurTours from './pages/OurTours'
import TourDetails from './pages/TourDetails'
import SignUpForm from './pages/SignUpForm'
import Login from "./components/Login";
import Admin from "./pages/Admin";
import AdminHome from "./pages/admin/AdminHome";
import AdminAboutUs from "./pages/admin/AdminAboutUs";
import AdminOurTours from "./pages/admin/AdminOurTours";
import AdminTourDetails from "./pages/admin/AdminTourDetails";
import AdminSignUpForm from "./pages/admin/AdminSignUpForm";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-tours" element={<OurTours />} />
        <Route path="/tour-details" element={<TourDetails />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/about-us" element={<AdminAboutUs />} />
        <Route path="/admin/our-tours" element={<AdminOurTours />} />
        <Route path="/admin/tour-details" element={<AdminTourDetails />} />
        <Route path="/admin/signup-form" element={<AdminSignUpForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
