import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import DoctorDashboard from './components/DoctorDashboard';
import PatientProfile from './components/PatientProfile';
import FoodDatabase from './components/FoodDatabase';
import DietChartBuilder from './components/DietChartBuilder';
import Reports from './components/Reports';
import MobilePatientView from './components/MobilePatientView';

type UserRole = 'doctor' | 'patient';
type CurrentPage = 'login' | 'dashboard' | 'patient-profile' | 'food-database' | 'diet-builder' | 'reports' | 'mobile-patient';

function App() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');

  // Update current page based on authentication state
  React.useEffect(() => {
    if (profile) {
      if (profile.role === 'doctor') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('mobile-patient');
      }
    } else if (!loading) {
      setCurrentPage('login');
    }
  }, [profile, loading]);

  const handleLogin = (role: UserRole) => {
    if (role === 'doctor') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('mobile-patient');
    }
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleNavigation = (page: CurrentPage) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return <Login onLogin={handleLogin} />;
  }

  if (profile.role === 'patient') {
    return <MobilePatientView onLogout={handleLogout} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DoctorDashboard onNavigate={handleNavigation} />;
      case 'patient-profile':
        return <PatientProfile onNavigate={handleNavigation} />;
      case 'food-database':
        return <FoodDatabase onNavigate={handleNavigation} />;
      case 'diet-builder':
        return <DietChartBuilder onNavigate={handleNavigation} />;
      case 'reports':
        return <Reports onNavigate={handleNavigation} />;
      default:
        return <DoctorDashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {renderCurrentPage()}
    </div>
  );
}

export default App;