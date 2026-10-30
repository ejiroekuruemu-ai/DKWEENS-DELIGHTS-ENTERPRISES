import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PackagesPage } from './pages/PackagesPage';
import { ServicesPage } from './pages/ServicesPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { BookingPage } from './pages/BookingPage';
import { StatusTrackerPage } from './pages/StatusTrackerPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CapstoneDocsPage } from './pages/CapstoneDocsPage';
import { RentalsPage } from './pages/RentalsPage';
import { GalleryPage } from './pages/GalleryPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'packages':
        return <PackagesPage />;
      case 'services':
        return <ServicesPage />;
      case 'rentals':
        return <RentalsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'planner':
        return <AIPlannerPage />;
      case 'booking':
        return <BookingPage />;
      case 'status':
        return <StatusTrackerPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'capstone-docs':
        return <CapstoneDocsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0C] text-[#FBF9F5] selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
