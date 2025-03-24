import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Clock,
  Check,
  Info
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

const appointmentTypes = [
  { id: 'consultation', name: 'General Consultation', duration: '30 min', price: '$75' },
  { id: 'followup', name: 'Follow-up Visit', duration: '20 min', price: '$50' },
  { id: 'checkup', name: 'Annual Check-up', duration: '45 min', price: '$120' },
  { id: 'urgent', name: 'Urgent Care', duration: '30 min', price: '$95' }
];

const BookingPage = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>('');
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const handleDateChange = (value: Value) => {
    setDate(value);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleAppointmentTypeSelect = (typeId: string) => {
    setSelectedAppointmentType(typeId);
  };

  const handleSubmit = () => {
    const reference = 'HT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingReference(reference);
    setBookingComplete(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (bookingComplete) {
    const selectedAppointmentTypeData = appointmentTypes.find(t => t.id === selectedAppointmentType);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
            <div className="bg-blue-600 px-6 py-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                  <Check className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center">Appointment Confirmed!</h1>
              <p className="text-center text-blue-100 mt-2">Your appointment has been successfully scheduled</p>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Reference Number</p>
                    <p className="text-lg font-medium text-gray-900">{bookingReference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-lg font-medium text-gray-900">
                      {date instanceof Date ? formatDate(date) : ''} at {selectedTimeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment Type</p>
                    <p className="text-lg font-medium text-gray-900">{selectedAppointmentTypeData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-medium text-gray-900">{selectedAppointmentTypeData?.duration}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Please arrive 15 minutes before your appointment time. If you need to cancel or reschedule, 
                      please do so at least 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  to="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            Choose your preferred date, time, and appointment type.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                  <div className="calendar-container">
                    <Calendar 
                      onChange={handleDateChange} 
                      value={date} 
                      minDate={new Date()}
                      className="rounded-lg border shadow-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                  {date ? (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((timeSlot) => (
                        <div
                          key={timeSlot}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                          className={`px-4 py-3 border rounded-md cursor-pointer text-center transition-all duration-200 ${
                            selectedTimeSlot === timeSlot
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <Clock className={`h-4 w-4 mr-2 ${selectedTimeSlot === timeSlot ? 'text-white' : 'text-gray-400'}`} />
                            <span>{timeSlot}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 border border-dashed border-gray-300 rounded-md">
                      <p className="text-gray-500">Please select a date first</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appointmentTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleAppointmentTypeSelect(type.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedAppointmentType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">Duration: {type.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-gray-900">{type.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!date || !selectedTimeSlot || !selectedAppointmentType}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                    date && selectedTimeSlot && selectedAppointmentType
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Confirm Booking
                  <Check className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingPage;