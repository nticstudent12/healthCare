import { Link } from 'react-router-dom';
import {
  User,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Bell,
  Clock,
  ChevronRight,

  AlertCircle,
  CheckCircle,
  ScanBarcodeIcon,
  Shield,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import api from '../utils/api/api'; // Fixed import path

import ScanUploaduser from '../components/ScanUploadUser';

type Appointment = {
  id: number;
  user: number;
  appointment_date: string; // ISO 8601 format
  status: 'missed' | 'completed' | 'cancelled' | 'pending' | 'confirmed' | 'upcoming';
};

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
};

interface Ticket {
  id: number;
  subject: string;
  description: string;
  reported_by: string;
  created_at: string;
  status: 'open' | 'closed' | 'pending' | string;
  response?: string; // Add response field
}

type UserData = {
  id: string;
  username: string;
  password: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  email: string;
  settings: {
    email_notifications: boolean;
    sms_notifications: boolean;
    dark_mode: boolean;
  };
  age: number;
  gender: string;
  phone_number: string;
  role: string;
  premium_status: boolean;
  ai_tries: number;
};

const DashboardPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'records' | 'settings' | 'support' | 'scaner' | 'medical-history'>('overview');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'Your appointment is tomorrow at 10:00 AM',
      time: '1 hour ago',
      type: 'info',
      read: false
    },
    {
      id: '2',
      title: 'Test Results Available',
      message: 'Your test results are now available',
      time: '2 hours ago',
      type: 'success',
      read: false
    },
    {
      id: '3',
      title: 'AI Result',
      message: 'Your AI Results are in!',
      time: '1 day ago',
      type: 'success',
      read: true
    }
  ]);
  
  const [userData, setUserData] = useState<UserData | null>(null);
  
 
  const [emailNotifications, setEmailNotifications] = useState(userData?.settings?.email_notifications ?? false);
  const [smsNotifications, setSmsNotifications] = useState(userData?.settings?.sms_notifications ?? false);
 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  interface MedicalHistoryRecord {
    id: number;
    user: number;
    scan: string;
    ai_interpretation: string | { diagnosis: string; confidence: number };
    appointment: number | null;
    record_date: string;
  }

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>([]);

  const updateMedicalHistory = async () => {
    try {
      const response = await api.get('/users/history/', {
      });
      setMedicalHistory(response.data);
      console.log("medical:", response.data);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  useEffect(() => {
      const fetchUserTickets = async () => {
        try {
          const response = await api.get('admin/ticket/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          console.log('User tickets:', response.data);
          setUserTickets(response.data);
        } catch (error) {
          console.error('Error fetching user tickets:', error);
        }
      };

      fetchUserTickets();
    }, []);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/users/notifications/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setNotifications(response.data); // Update notifications state with fetched data
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  fetchNotifications();
}, [activeTab]);
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await api.get('/users/history/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setMedicalHistory(response.data);
        console.log("medical:", response.data);
      } catch (error) {
        console.error('Error fetching medical history:', error);
      }
    };

    if (activeTab === 'records') {
      fetchMedicalHistory();
    }
  }, [activeTab === 'medical-history']);

  useEffect(() => {
    if (activeTab === 'records') {
      updateMedicalHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'records') {
      updateMedicalHistory();
    }
  }, [activeTab]);

  

  // Fetch appointments data when component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
       
        const response = await api.get('/users/appointments/');
        sessionStorage.setItem('appointments', JSON.stringify(response.data));
        setAppointments(response.data);
        console.log('Appointments data:', response.data);
       
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  const appointments_lengh =appointments.length || "no appointments" ;
 
  
 

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
     
        const response = await api.get('/users/me/');
        setUserData(response.data);
        console.log('User data:', response.data);
       
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
     
    };
    
    fetchUserData();
  }, []);
  const name = userData?.first_name && userData?.last_name 
    ? `${userData.first_name} ${userData.last_name}` 
    : userData?.username || 'Guest'; // Fallback to username or 'Guest' if not available
  const patient_id = userData?.id || '000000'
  
  //this function decide what is the color of status

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'missed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-orange-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

// Function to format message with date
const formatMessageWithDate = (message: string) => {
  const isoDateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\+\d{2}:\d{2}|Z)?/;
  const match = message.match(isoDateRegex);
  if (match) {
    const isoString = match[0].replace(' ', 'T');
    const dateObj = new Date(isoString);
    const formatted = dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return message.replace(match[0], formatted);
  }
  return message;
};

// Effect to handle initial loading from userData
useEffect(() => {
  if (userData?.settings) {
    setEmailNotifications(userData.settings.email_notifications);
    setSmsNotifications(userData.settings.sms_notifications);
  }
}, [userData]); // Run whenever userData changes

// Handler for toggling email notifications
const toggleEmailNotifications = () => {

  setEmailNotifications((prev) => !prev);
  console.log('Email notifications toggled:', !emailNotifications);
};

// Handler for toggling SMS notifications
const toggleSmsNotifications = () => {
  setSmsNotifications((prev) => !prev);
  console.log('SMS notifications toggled:', !smsNotifications);
};

const handleTicketSubmit = async () => {
  const ticketData = {
    subject,
    description,
  };
  try {
    console.log('Submitting ticket:', ticketData);
    const response = await api.post('users/ticket/create/', ticketData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    console.log('Ticket submitted successfully:', response.data);
    alert('Ticket submitted successfully!');
    setUserTickets((prev) => [response.data, ...prev]); // Add the new ticket to the list
    setSubject(''); // Clear the subject field
    setDescription(''); // Clear the description field
  } catch (err) {
    console.error('Error submitting ticket:', err);
    alert('Failed to submit ticket. Please try again.');
  }
}
  const handlePasswordChange = async () => {
    const passwordData = {
      new_password: newPassword,
      old_password: currentPassword,
    };
    console.log('Updated data:', passwordData);
    try {
      
      const response = await api.patch('users/me/password/', passwordData);
      
      console.log('User data updated successfully:', response.data);
    
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
    
    } 
  }

  const handleSaveChanges = async () => {
    const firstNameInput = document.querySelector<HTMLInputElement>('input[placeholder="First Name"]');
    const lastNameInput = document.querySelector<HTMLInputElement>('input[placeholder="Last Name"]');
    const emailInput = document.querySelector<HTMLInputElement>('input[placeholder="Email"]');
    const phoneInput = document.querySelector<HTMLInputElement>('input[placeholder="Phone"]');

    const updatedData: Partial<UserData> = {
      first_name: firstNameInput?.value || userData?.first_name,
      last_name: lastNameInput?.value || userData?.last_name,
      email: emailInput?.value || userData?.email,
      phone_number: phoneInput?.value || userData?.phone_number,
     
    };
    console.log('Updated data:', updatedData);
    try {
    
      const response = await api.patch('/users/me/', updatedData);
      setUserData(response.data);
      console.log('User data updated successfully:', response.data);
     
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Error saving changes:', err);
      
    } 
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    // Update state when input changes
    if (userData) {
      setUserData({
        ...userData,
        [field]: e.target.value, // dynamically update the specific field
      });
    }
  };

  const renderOverview = () => (
     
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{appointments_lengh}</p>
            </div>
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Medical Records</p>
             <p> {medicalHistory.length || "No records"}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Messages</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Appointments</h3>
        <div className="space-y-4">
          {(() => {
            const confirmedAppointments = appointments.filter(
              (appointment) => appointment.status === 'confirmed'
            );
            if (confirmedAppointments.length === 0) {
              return (
                <p className="text-gray-500 text-sm">No Upcoming Appointments</p>
              );
            }
            return confirmedAppointments.map((completedAppointment) => (
              <div key={completedAppointment.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-base text-gray-900">
                      {new Date(completedAppointment.appointment_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at{' '}
                      {new Date(completedAppointment.appointment_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  to="/reschedule"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reschedule
                </Link>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
  <div className="space-y-4">
    {notifications.length > 0 ? (
      notifications
        .slice()
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // Sort by time (most recent first)
        .slice(0, 3) // Display only the 3 most recent notifications
        .map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              notification.read ? 'bg-gray-50' : 'bg-blue-100'
            }`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                <Bell className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-gray-900">{notification.title}</p>
              <p className="mt-1 text-md text-gray-900">
                {formatMessageWithDate(notification.message)}
              </p>
              
            </div>
          </div>
        ))
    ) : (
      <p className="text-sm text-gray-500">No recent notifications available.</p>
    )}
  </div>
</div>
    </div>
  );

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await api.delete(`/users/appointments/${appointmentId}/`);
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: 'cancelled' } : app
        )
      );
      alert('Appointment cancelled successfully.');
    } catch (error) {
      alert('Failed to cancel appointment.');
      console.error('Cancel error:', error);
    }
  };

  const renderAppointments = () => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Appointments</h3>
          <Link
            to="/book-appointment"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Book New Appointment
          </Link>
        </div>
        <div className="space-y-4">
          {[...appointments]
            .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
            .map(appointment => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      {/* here this section is to make the date and time of the appointment in the right format */}
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                      <div>
                        {appointment.status === 'pending' && (
                          <Link
                            to={`/reschedule`}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-white bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 hover:border-blue-700 transition-colors mr-2"
                          >
                            Reschedule
                          </Link>
                        )}
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-red-600 text-white bg-red-600 rounded-md text-sm font-medium hover:bg-red-700 hover:border-red-700 transition-colors"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );


  const renderMedicalHistory = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Medical History</h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Interpretation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicalHistory
                  .slice() // Create a shallow copy to avoid mutating the original array
                  .sort((a, b) => new Date(b.record_date).getTime() - new Date(a.record_date).getTime()) // Sort by record_date (descending)
                  .map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={record.scan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Scan
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof record.ai_interpretation === 'string'
                          ? record.ai_interpretation
                          : record.ai_interpretation && record.ai_interpretation.diagnosis && record.ai_interpretation.confidence
                          ? `${record.ai_interpretation.diagnosis} (${record.ai_interpretation.confidence.toFixed(2)}%)`
                          : 'No interpretation available'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.appointment ? `Appointment ID: ${record.appointment}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.record_date).toLocaleString()}
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

  const renderSettings = () => (
    
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userData?.first_name || ''}
                  onChange={(e) => handleInputChange(e, 'first_name')} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userData?.last_name || ''}
                  onChange={(e) => handleInputChange(e, 'last_name')} 

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userData?.email || ''}
                  onChange={(e) => handleInputChange(e, 'email')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={userData?.phone_number || ''}
                  onChange={(e) => handleInputChange(e, 'phone_number')}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Notification Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about your appointments</p>
                </div>
                <button
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onClick={toggleEmailNotifications}
        >
          <span
            className={`${
              emailNotifications ? 'translate-x-5' : 'translate-x-0'
            } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          ></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive text messages for appointment reminders</p>
                </div>
                <button
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onClick={toggleSmsNotifications}
        >
          <span
            className={`${
              smsNotifications ? 'translate-x-5' : 'translate-x-0'
            } inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
          ></span>
        </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-900 mb-4">Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Current Password"
                  value= {currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              onClick={handlePasswordChange}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  


  const renderSupport = () => {
    const handleTicketSubmit = async () => {
      const ticketData = {
        subject,
        description,
      };
      try {
        console.log('Submitting ticket:', ticketData);
        const response = await api.post('users/ticket/create/', ticketData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        console.log('Ticket submitted successfully:', response.data);
        alert('Ticket submitted successfully!');
        setUserTickets((prev) => [response.data, ...prev]); // Add the new ticket to the list
        setSubject(''); // Clear the subject field
        setDescription(''); // Clear the description field
      } catch (err) {
        console.error('Error submitting ticket:', err);
        alert('Failed to submit ticket. Please try again.');
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Ticket</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTicketSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter the subject of your ticket"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue or question"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Your Support Tickets</h3>
            <div className="space-y-4 mt-6">
              {userTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ticket.status === 'open'
                              ? 'bg-red-100 text-red-800'
                              : ticket.status === 'closed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{ticket.subject}</h4>
                      <p className="text-gray-600 mb-4">{ticket.description}</p>

                      {ticket.response && (
                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800">Admin Response:</span>
                          </div>
                          <p className="text-blue-700">{ticket.response}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  function renderScan() {
    return (
        <ScanUploaduser />
      )
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='h-8'></div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col md:flex-row gap-8 ">
          {/* Sidebar */}
          <div className="w-full md:w-64 ">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500 ">Patient ID: #{patient_id}</p>
          <p className="text-sm">
            {userData?.premium_status ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Premium Member
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
            Standard Member
              </span>
            )}
          </p>
            </div>
          </div>
              
                <nav className="space-y-2 ">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Overview</span>
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
                  onClick={() =>{
                    updateMedicalHistory
                    setActiveTab('records')
                  }
                  }
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'records'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Medical History</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
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
                  <span>Scanner</span>
                </button>

                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === 'support'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Support</span>
                  
                </button>

                
                </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'appointments' && renderAppointments()}
            {activeTab === 'records' &&  renderMedicalHistory()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'support' && renderSupport()}
            {activeTab === 'scaner' && renderScan()}
         
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;