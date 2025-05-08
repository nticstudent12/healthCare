import { 
  User, 
  
  FileText, 
  Users, 
  Brain, 
  Search, 
  Download, 
  BarChart, 

  Shield, 
  Gift, 
  ArrowLeft, 
  UserCircle,
  Mail,
  Phone,
  UserX,
  
  Calendar,
  
  Plus,
  Edit,
  
  ScanBarcodeIcon,
  
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import api from '../utils/api/api';
import ScanUpload from '../components/ScanUpload';
interface MedicalHistoryRecord {
  id: number;
  user: number; // User ID associated with the record
  scan: string; // URL of the scan image
  ai_interpretation: string | { diagnosis: string; confidence: number }; // AI interpretation can be a string or an object
  appointment: number | null; // Appointment ID or null if not linked
  record_date: string; // ISO date string
}
interface Appointment {
  id: number;
  user: number; // User ID associated with the appointment
  appointment_date: string; // ISO date string
  status: 'completed' | 'pending' | 'confirmed' | 'finished'; // Enum for status
  reference: string | null; // Optional reference field
}
interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  age: number;
  gender: string;
  role: string;
  premium_status: boolean;
  ai_tries: number;
  settings: Record<string, unknown>; // Use a more specific type if you know the structure
  pic: string | null;
}

interface Coupon {
  id: number;
  coupon_code: string;
  valid_until: string;
  description: string;
}

interface AIModel {
  id: number;
  model_name: string;
  created_at: string;
  status: string;
  parameters: Record<string, unknown>;
}

interface Doctor {
    first_name : string;
    last_name : string;
    specialty : string;
    wilaya  : string;
    license_number : string;
    phone_number : string;
    status : string;
    address : string;
    email : string;
    external_id : string;
}


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'users' | 'reports' | 'ai-models' | 'coupons' | 'user-details'| 'appointments' |'medical-history'|'scaner'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]); // State to store users
  const [totalUsers, setTotalUsers] = useState(0); // State for total users
  const [coupons, setCoupons] = useState<Coupon[]>([]); // State to store coupons
  const [aiModels, setAIModels] = useState<AIModel[]>([]); // State for AI models
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for selected user
  const [appointments, setAppointments] = useState<Appointment[]>([]); 
  const [doctors, setDoctors] = useState<Doctor[]>([]); // State for doctors
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null); // State for dropdown visibility

 // State for medical history

 useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const response = await api.get('admin/list-doctors/');
      setDoctors(response.data); // Update medical history state
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  if (activeTab === 'doctors' || activeTab === 'overview') {
    fetchDoctors();
  }
}, [activeTab]);

const SyncDatabase = async () => {
  try {
    const response = await api.post('admin/sync-doctors/');
    console.log('Database synced successfully:', response.data);
    try {
      const response = await api.get('admin/list-doctors/');
      setDoctors(response.data); // Update medical history state
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
    alert('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
    alert('Failed to sync database. Please try again.');
  }
  
}

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/admin/appointments/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setAppointments(response.data);
        console.log(response.data) // Update appointments state
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);


  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]); 

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await api.get('/admin/history/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setMedicalHistory(response.data); // Update medical history state
      } catch (error) {
        console.error('Error fetching medical history:', error);
      }
    };
  
    if (activeTab === 'medical-history') {
      fetchMedicalHistory();
    }
  }, [activeTab]);

  const renderMedicalHistory = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical History</h3>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Interpretation
                </th>
               
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicalHistory.map((medicalHistory) => (
                <tr key={medicalHistory.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {users.find((user) => user.id === medicalHistory.user)?.username || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a
                      href={medicalHistory.scan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Scan
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof medicalHistory.ai_interpretation === 'string'
                      ? medicalHistory.ai_interpretation
                      : `${medicalHistory.ai_interpretation.diagnosis} (${medicalHistory.ai_interpretation.confidence.toFixed(
                          2
                        )}%)`}
                  </td>
   
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(medicalHistory.record_date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); // State for selected status

  useEffect(() => {
    const fetchFilteredAppointments = async (status: string | null) => {
      try {
        const endpoint = status
          ? `/admin/appointments/status/${status}/`
          : '/admin/appointments/';
        const response = await api.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setAppointments(response.data); // Update appointments state
      } catch (error) {
        console.error('Error fetching filtered appointments:', error);
      }
    };

    fetchFilteredAppointments(selectedStatus); // Fetch appointments when the filter changes
  }, [selectedStatus]);

  const renderAppointments = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <select
              className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
            >
              <option value="" className="text-gray-500">All Statuses</option>
              <option value="completed" className="text-green-600 font-medium">Completed</option>
              <option value="pending" className="text-yellow-600 font-medium">Pending</option>
              <option value="confirmed" className="text-blue-600 font-medium">Confirmed</option>
              <option value="finished" className="text-gray-600 font-medium">Finished</option>
            </select>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {users.find((user) => user.id === appointment.user)?.username || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appointment.appointment_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appointment.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <div className="relative group">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() =>
                              setDropdownVisible(
                                dropdownVisible === appointment.id ? null : appointment.id
                              )
                            }
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          {dropdownVisible === appointment.id && (
                            <select
                              className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm text-gray-700"
                              value={appointment.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                try {
                                  await api.patch(`/admin/appointments/${appointment.id}/`, {
                                    status: newStatus,
                                  });
                                  alert(`Status updated to ${newStatus}`);
                                  setAppointments((prevAppointments) =>
                                    prevAppointments.map((appt) =>
                                      appt.id === appointment.id
                                        ? {
                                            ...appt,
                                            status: newStatus as
                                              | 'completed'
                                              | 'pending'
                                              | 'confirmed'
                                              | 'finished',
                                          }
                                        : appt
                                    )
                                  );
                                  setDropdownVisible(null); // Close the dropdown
                                } catch (error) {
                                  console.error('Error updating status:', error);
                                  alert('Failed to update status. Please try again.');
                                }
                              }}
                            >
                              <option value="completed">Completed</option>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="finished">Finished</option>
                            </select>
                          )}
                        </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include token if required
          },
        });
        setUsers(response.data); // Update users state
        setTotalUsers(response.data.length); // Update total users count
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchCoupons = async () => {
      try {
        const response = await api.get('/admin/coupons/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include token if required
          },
        });
        setCoupons(response.data); // Update coupons state
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    const fetchAIModels = async () => {
      try {
        const response = await api.get('/admin/ai/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setAIModels(response.data); // Update AI models state
      } catch (error) {
        console.error('Error fetching AI models:', error);
      }
    };

    if (activeTab === 'users' || activeTab === 'overview') {
      fetchUsers();
    }

    if (activeTab === 'coupons') {
      fetchCoupons();
    }

    if (activeTab === 'ai-models') {
      fetchAIModels();
    }
  }, [activeTab]);

  const renderOverview = () => (
    
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">{doctors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-amber-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Reports</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">AI Models</p>
              <p className="text-2xl font-semibold text-gray-900">{aiModels.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Server Load</span>
              <span className="text-sm font-medium text-green-600">Normal</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Response Time</span>
              <span className="text-sm font-medium text-green-600">238ms</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">AI Model Accuracy</span>
              <span className="text-sm font-medium text-blue-600">97.8%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '97.8%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            {
              type: 'doctor_approval',
              message: 'New doctor registration pending approval',
              time: '5 minutes ago',
              icon: User,
              iconColor: 'text-blue-500'
            },
            {
              type: 'ai_update',
              message: 'AI Model v2.3.0 deployment completed',
              time: '1 hour ago',
              icon: Brain,
              iconColor: 'text-purple-500'
            },
            {
              type: 'report',
              message: 'Technical report #458 requires review',
              time: '2 hours ago',
              icon: FileText,
              iconColor: 'text-amber-500'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className={`flex-shrink-0 ${activity.iconColor}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  function renderScan() {
    return (
        <ScanUpload />
      )
  };

  const renderDoctors = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Manage Doctors</h3>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => SyncDatabase()}
            >
              Sync with Database
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
               
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doctor.first_name + " " + doctor.last_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (doctor.status) === 'active'
                        ? 'bg-green-100 text-green-800'
                        : (doctor.status || 'inactive') === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {(doctor.status || 'inactive').charAt(0).toUpperCase() + (doctor.status || 'inactive').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.license_number}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const renderUsers = () => (
    <div className="bg-w</span>hite rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users
                .filter((user: User) =>
                  user.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user: User, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.premium_status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.premium_status ? 'Premium' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={() => {
                          setSelectedUser(user);
                          setActiveTab('user-details');
                        }}
                      >
                        View Details
                      </button>
                    
                    </td>
                    
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const renderUserDetails = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <button
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200 group"
        onClick={() => setActiveTab('users')}
      >
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to User Management</span>
      </button>
  
      {selectedUser ? (
        <div className="space-y-8">
          {/* Header with user status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.username}</h2>
              <p className="text-gray-500">User ID: {selectedUser.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              selectedUser.premium_status 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {selectedUser.premium_status ? 'Premium Member' : 'Standard Member'}
            </span>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center mb-4">
                <UserCircle className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <DetailRow 
                  label="Full Name:" 
                  value={`${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || 'Not provided'} 
                />
                <DetailRow 
                  label="Email:" 
                  value={selectedUser.email || <span className="text-gray-400">Not available</span>}
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                />
                <DetailRow 
                  label="Phone:" 
                  value={selectedUser.phone_number || <span className="text-gray-400">Not provided</span>}
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                />
              </div>
            </div>
  
            {/* Account Information Card */}
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
              </div>
              
              <div className="space-y-4">
                <DetailRow 
                  label="User Role:" 
                  value={<span className="capitalize">{selectedUser.role}</span>}
                />
                <DetailRow 
                  label="Age:" 
                  value={selectedUser.age || <span className="text-gray-400">Not specified</span>}
                />
                <DetailRow 
                  label="Gender:" 
                  value={selectedUser.gender === 'M' ? 'Male' : selectedUser.gender === 'F' ? 'Female' : 'Other'}
                />
                <DetailRow 
                  label="AI Tries:" 
                  value={selectedUser.ai_tries ?? <span className="text-gray-400">Not available</span>}
                />
              </div>
            </div>
          </div>
  
          {/* Additional Actions Section */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              onClick={async () => {
              try {
                const response = await api.get(`/admin/history/user/${selectedUser?.id}/`, {
                });
                alert(`Medical History: ${JSON.stringify(response.data, null, 2)}`);
              } catch (error) {
                console.error('Error fetching medical history:', error);
                alert('Failed to fetch medical history. Please try again.');
              }
              }}
            >
              View Medical History
            </button>
          {selectedUser?.premium_status && (
  <button
    className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
    onClick={async () => {
      if (window.confirm(`Are you sure you want to revoke premium access for ${selectedUser.username}?`)) {
        try {
          // Send PATCH request to update the premium status
          await api.patch(
            `/admin/users/${selectedUser.id}/revoke/`,
            { premium_status: false }, // Payload to update premum status
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
          alert('Premium access revoked successfully.');
          setSelectedUser({
            ...selectedUser,
            premium_status: false,
            ai_tries: Math.max(selectedUser.ai_tries - 5, 0), // Update AI tries locally
          });
        } catch (error) {
          console.error('Error revoking premium access:', error);
          alert('Failed to revoke premium access. Please try again.');
        }
      }
    }}
  >
    Revoke Premium Access
  </button> 

  
)}

          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <UserX className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No User Selected</h3>
          <p className="mt-2 text-gray-500">Please select a user from the list to view details</p>
        </div>
      )}
    </div>
  );
  
  // Improved DetailRow component
  const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <div className="col-span-2 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <p className="text-sm text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Technical Reports</h3>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select className="border border-gray-300 rounded-md px-4 py-2">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'TR-001',
                title: 'System Performance Analysis',
                priority: 'High',
                status: 'Pending Review',
                date: '2024-03-15',
                author: 'Dr. Sarah Johnson'
              },
              {
                id: 'TR-002',
                title: 'AI Model Accuracy Report',
                priority: 'Medium',
                status: 'Approved',
                date: '2024-03-14',
                author: 'Dr. Michael Chen'
              }
            ].map((report, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">#{report.id}</span>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.priority}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mt-1">{report.title}</h4>
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">By {report.author}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm text-gray-500">{report.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  const renderAIModels = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">AI Models</h3>
              <p className="text-sm text-gray-500 mt-1">Manage and deploy your AI models</p>
            </div>
            <div>
            <input
  type="file"
  id="modelFileInput"
  accept=".h5,.keras"
  style={{ display: 'none' }}
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('model_file', file);
      formData.append('model_name', file.name);

                try {
                  const response = await api.post('/admin/ai/upload/', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  },
                  });
                  alert('Model uploaded successfully.');
                  setAIModels((prevModels) => [...prevModels, response.data]);
                } catch (error) {
                  console.error('Error uploading model:', error);
                  alert('Failed to upload the model. Please try again.');
                }
                }
              }}
              />

              <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => document.getElementById('modelFileInput')?.click()}
              >
              <Plus className="h-4 w-4" />
              Deploy New Model
              </button>
            </div>
          </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model) => (
              <div 
              key={model.id} 
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 bg-white"
              >
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 truncate">{model.model_name}</h4>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium self-start ${
                model.status === 'deployed'
                  ? 'bg-green-100 text-green-800'
                  : model.status === 'archived'
                  ? 'bg-gray-100 text-gray-800'
                  : model.status === 'vip'
                  ? 'bg-purple-100 text-red-800'
                  : ''
                }`}>
                {model.status}
                </div>
              </div>
  
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Created: {new Date(model.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
  
                
                </div>
  
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
                
                    <button
                      className="px-3 py-1.5 text-base text-red-600 border border-red-600 hover:bg-green-50 rounded-md transition-colors"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the AI model "${model.model_name}"?`)) {
                          api
                            .delete(`/admin/ai/${model.id}/`, {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                              },
                            })
                            .then(() => {
                              alert('AI model deleted successfully.');
                              setAIModels((prevModels) =>
                                prevModels.filter((m) => m.id !== model.id)
                              );
                            })
                            .catch((error) => {
                              console.error('Error deleting AI model:', error);
                              alert('Failed to delete the AI model. Please try again.');
                            });
                        }
                      }}
                    >
                      Delete
                    </button>
                  <select
                  className="px-3 py-1.5 text-base text-blue-600 border border-blue-600 rounded-md transition-colors"
                  value={model.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    try {
                    await api.patch(`/admin/ai/${model.id}/`, { status: newStatus }, {
                      headers: {
                      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                      },
                    });
                    alert(`AI Model status updated to ${newStatus}`);
                    setAIModels((prevModels) =>
                      prevModels.map((m) =>
                      m.id === model.id ? { ...m, status: newStatus } : m
                      )
                    );
                    } catch (error) {
                    console.error('Error updating AI model status:', error);
                    alert('Failed to update status. Please try again.');
                    }
                  }}
                  >
                  <option value="archived" className='text-gray-800-800'>Archived</option>
                  <option value="deployed" className='text-green-800'>Deployed</option>
                  <option value="vip" className='text-red-800'>VIP</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Coupons</h3>
            <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 rounded-lg"
            onClick={async () => {
              const couponCode = prompt("Enter coupon code:");
              const validUntil = prompt("Enter valid until date (YYYY-MM-DD):");
              const description = prompt("Enter coupon description:");

              if (couponCode && validUntil && description) {
              // Validate and format the date
              const parsedDate = new Date(validUntil);
              if (isNaN(parsedDate.getTime())) {
                alert('Invalid date format. Please use YYYY-MM-DD.');
                return;
              }
              const formattedDate = parsedDate.toISOString().split('T')[0]; // Ensure proper format

              try {
                const response = await api.post(
                '/admin/coupons/create/',
                {
                  coupon_code: couponCode,
                  valid_until: formattedDate,
                  description: description,
                },
                {
                  headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  },
                }
                );
                alert('Coupon created successfully.');
                
                setCoupons((prevCoupons) => [...prevCoupons, response.data]);
              } catch (error) {
                console.error('Error creating coupon:', error);
                alert('Failed to create coupon. Please try again.');
              }
              } else {
              alert('All fields are required to create a coupon.');
              }
            }}
            >
            <Plus className="h-4 w-4" />
            Add Coupon
            </button>
           
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {coupon.coupon_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(coupon.valid_until).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coupon.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='h-8'></div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                  <p className="text-sm text-gray-500">System Control</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'overview'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart className="h-5 w-5" />
                  <span>Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'doctors'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Doctors</span>
                </button>
                <button
  onClick={() => setActiveTab('medical-history')}
  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
    activeTab === 'medical-history'
      ? 'bg-blue-50 text-blue-700'
      : 'text-gray-600 hover:bg-gray-50'
  }`}
>
  <FileText className="h-5 w-5" />
  <span>Medical History</span>
</button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'users'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'appointments'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Appointments</span>
                </button>
                <button
                  onClick={() => setActiveTab('scaner')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'scaner'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ScanBarcodeIcon className="h-5 w-5" />
                  <span>scaner</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'reports'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Reports</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('ai-models')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'ai-models'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Brain className="h-5 w-5" />
                  <span>AI Models</span>
                </button>

                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'coupons'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Gift className="h-5 w-5" />
                  <span>Coupons</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'doctors' && renderDoctors()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'user-details' && renderUserDetails()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'ai-models' && renderAIModels()}
            {activeTab === 'coupons' && renderCoupons()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'medical-history' && renderMedicalHistory()}
            {activeTab === 'scaner' && renderScan()}
        
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;