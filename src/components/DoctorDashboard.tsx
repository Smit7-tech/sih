import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Plus, 
  UserPlus,
  Bell,
  Search,
  MoreVertical
} from 'lucide-react';
import Sidebar from './Sidebar';
import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../hooks/useAuth';

type CurrentPage = 'login' | 'dashboard' | 'patient-profile' | 'food-database' | 'diet-builder' | 'reports' | 'mobile-patient';

interface DoctorDashboardProps {
  onNavigate: (page: CurrentPage) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { patients, loading } = usePatients();

  const stats = [
    { label: 'Total Patients', value: patients.length.toString(), icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Diet Plans', value: '89', icon: FileText, color: 'bg-green-500', change: '+8%' },
    { label: 'This Month Consultations', value: '156', icon: Calendar, color: 'bg-purple-500', change: '+15%' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'bg-amber-500', change: '+3%' },
  ];

  const recentPatients = patients.slice(0, 4).map(patient => ({
    name: patient.profile?.full_name || 'Unknown',
    age: patient.age || 0,
    lastVisit: new Date(patient.updated_at).toLocaleDateString(),
    condition: patient.constitution || 'General Health'
  }));

  const upcomingAppointments = [
    { patient: 'Meera Joshi', time: '10:00 AM', type: 'Follow-up' },
    { patient: 'Arjun Gupta', time: '11:30 AM', type: 'New Consultation' },
    { patient: 'Kavya Reddy', time: '2:00 PM', type: 'Diet Review' },
    { patient: 'Sanjay Mehta', time: '3:30 PM', type: 'Progress Check' },
  ];

  return (
    <div className="flex">
      <Sidebar 
        currentPage="dashboard" 
        onNavigate={onNavigate} 
        onLogout={() => onNavigate('login')} 
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || 'Doctor'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <div className={`${stat.color} rounded-lg p-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => onNavigate('diet-builder')}
              className="bg-green-500 text-white p-6 rounded-xl shadow-sm hover:bg-green-600 transition-colors text-left"
            >
              <Plus className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create New Diet Chart</h3>
              <p className="text-green-100">Design personalized Ayurvedic meal plans</p>
            </button>
            
            <button
              onClick={() => onNavigate('patient-profile')}
              className="bg-blue-500 text-white p-6 rounded-xl shadow-sm hover:bg-blue-600 transition-colors text-left"
            >
              <UserPlus className="w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Add New Patient</h3>
              <p className="text-blue-100">Register and manage patient profiles</p>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Patients</h3>
                  <button 
                    onClick={() => onNavigate('patient-profile')}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center text-gray-500">Loading patients...</div>
                ) : recentPatients.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No patients yet</div>
                ) : recentPatients.map((patient, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.condition} • Age {patient.age}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{patient.lastVisit}</p>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    View Calendar
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{appointment.time}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          appointment.type === 'New Consultation' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;