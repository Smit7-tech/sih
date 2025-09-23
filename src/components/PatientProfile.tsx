import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Weight, 
  Activity, 
  FileText, 
  TrendingUp,
  Edit3,
  Plus,
  Download
} from 'lucide-react';
import Sidebar from './Sidebar';
import { usePatients } from '../hooks/usePatients';
import { useState as useReactState } from 'react';

type CurrentPage = 'login' | 'dashboard' | 'patient-profile' | 'food-database' | 'diet-builder' | 'reports' | 'mobile-patient';

interface PatientProfileProps {
  onNavigate: (page: CurrentPage) => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ onNavigate }) => {
  const { patients, loading, addPatient } = usePatients();
  const [activeTab, setActiveTab] = useState<'profile' | 'diet-charts' | 'progress' | 'reports'>('profile');
  const [selectedPatientIndex, setSelectedPatientIndex] = useReactState(0);
  const [showAddForm, setShowAddForm] = useReactState(false);

  const patient = patients[selectedPatientIndex] || null;

  const [newPatient, setNewPatient] = useReactState({
    age: 0,
    gender: 'female' as 'male' | 'female' | 'other',
    weight: 0,
    height: 0,
    blood_group: '',
    address: '',
    occupation: '',
    constitution: '',
    allergies: '',
    medical_history: ''
  });

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await addPatient(newPatient);
    if (!error) {
      setShowAddForm(false);
    }
  };

  const dietCharts = [
    { date: '2024-01-15', title: 'Weight Management Plan', status: 'Active', duration: '4 weeks' },
    { date: '2023-12-01', title: 'Digestive Health Focus', status: 'Completed', duration: '6 weeks' },
    { date: '2023-10-15', title: 'Stress Relief Diet', status: 'Completed', duration: '8 weeks' },
  ];

  const progressData = [
    { metric: 'Weight', current: '65 kg', previous: '68 kg', change: '-3 kg', trend: 'down' },
    { metric: 'BMI', current: '22.4', previous: '23.5', change: '-1.1', trend: 'down' },
    { metric: 'Energy Level', current: '8/10', previous: '6/10', change: '+2', trend: 'up' },
    { metric: 'Sleep Quality', current: '7/10', previous: '5/10', change: '+2', trend: 'up' },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'diet-charts', label: 'Diet Charts', icon: FileText },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: Activity },
  ];

  return (
    <div className="flex">
      <Sidebar 
        currentPage="patient-profile" 
        onNavigate={onNavigate} 
        onLogout={() => onNavigate('login')} 
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {patient ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-green-700">
                      {patient.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{patient.profile?.full_name || 'Patient'}</h1>
                    <p className="text-gray-600">{patient.age} years • {patient.gender} • {patient.constitution}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Patient Management</h1>
                  <p className="text-gray-600">Manage patient profiles and information</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Patient
              </button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto bg-stone-50">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading patients...</div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No patients added yet</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Your First Patient
              </button>
            </div>
          ) : (
            <>
              {/* Patient Selector */}
              {patients.length > 1 && (
                <div className="mb-6">
                  <select
                    value={selectedPatientIndex}
                    onChange={(e) => setSelectedPatientIndex(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    {patients.map((p, index) => (
                      <option key={p.id} value={index}>
                        {p.profile?.full_name || `Patient ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Weight</label>
                      <p className="font-medium text-gray-800">{patient?.weight ? `${patient.weight} kg` : 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Height</label>
                      <p className="font-medium text-gray-800">{patient?.height ? `${patient.height} cm` : 'Not set'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">BMI</label>
                      <p className="font-medium text-gray-800">{patient?.bmi || 'Not calculated'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Blood Group</label>
                      <p className="font-medium text-gray-800">{patient?.blood_group || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ayurvedic Constitution</label>
                    <p className="font-medium text-amber-600">{patient?.constitution || 'Not assessed'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium text-gray-800">{patient?.profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-gray-800">{patient?.profile?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-medium text-gray-800">{patient?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Occupation</label>
                    <p className="font-medium text-gray-800">{patient?.occupation || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-600">Allergies</label>
                    <p className="font-medium text-red-600">{patient?.allergies || 'None reported'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Medical History</label>
                    <p className="font-medium text-gray-800">{patient?.medical_history || 'None reported'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}

          {/* Add Patient Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={newPatient.age}
                        onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={newPatient.gender}
                        onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Constitution</label>
                    <input
                      type="text"
                      value={newPatient.constitution}
                      onChange={(e) => setNewPatient({...newPatient, constitution: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="e.g., Vata-Pitta"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add Patient
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'diet-charts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Diet Chart History</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {dietCharts.map((chart, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{chart.title}</h4>
                          <p className="text-sm text-gray-600">Created on {chart.date} • {chart.duration}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            chart.status === 'Active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {chart.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">{item.metric}</h4>
                    <span className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Previous</span>
                      <span>{item.previous}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current</span>
                      <span className="font-medium">{item.current}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated Reports</h3>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reports generated yet</p>
                <button 
                  onClick={() => onNavigate('reports')}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;