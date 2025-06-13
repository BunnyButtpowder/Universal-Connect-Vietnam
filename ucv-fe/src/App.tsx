import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from 'react';
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
import AdminTranslations from "./pages/admin/AdminTranslations";
import SpringTourDetails from "./pages/SpringTourDetails";
import AdminSpringTourDetails from "./pages/admin/AdminSpringTourDetails";
import { useContentStore } from "./lib/contentStore";
import { AdminGuard } from "./components/AdminGuard";
import { Toaster } from "sonner";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";

function AppContent() {
  const fetchContent = useContentStore(state => state.fetchContent);
  const fetchTranslations = useContentStore(state => state.fetchTranslations);
  const setLanguage = useContentStore(state => state.setLanguage);
  const isLoading = useContentStore(state => state.isLoading);
  const error = useContentStore(state => state.error);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Fetch content and translations when the app loads
    fetchContent();
    fetchTranslations();
  }, [fetchContent, fetchTranslations]);

  useEffect(() => {
    // Sync language between context and content store
    setLanguage(language);
  }, [language, setLanguage]);

  // Show loading state if needed
  if (isLoading && window.location.pathname !== '/admin') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">{t('loading.content')}</p>
      </div>
    </div>;
  }

  // Show error state if there's an issue
  if (error && window.location.pathname !== '/admin') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
        <p className="text-red-500 text-xl mb-4">{t('loading.error')}</p>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => fetchContent()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('loading.tryAgain')}
        </button>
      </div>
    </div>;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/our-tours" element={<OurTours />} />
        <Route path="/tour-details/:slug" element={<TourDetails />} />
        <Route path="/spring-tour-details" element={<SpringTourDetails />} />
        <Route path="/sign-up/:tourId" element={<SignUpForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Navigate to="/sign-up/fallTour2025" />} />
        
        {/* Protected Admin Routes */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/about-us" element={<AdminAboutUs />} />
          <Route path="/admin/our-tours" element={<AdminOurTours />} />
          <Route path="/admin/tour-details" element={<AdminTourDetails />} />
          <Route path="/admin/spring-tour-details" element={<AdminSpringTourDetails />} />
          <Route path="/admin/signup-form" element={<AdminSignUpForm />} />
          <Route path="/admin/translations" element={<AdminTranslations />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
