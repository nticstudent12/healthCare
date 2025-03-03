import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Heart, Clock, User, Mail, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Define available time slots
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

// Define doctor specialties
const specialties = [
  { id: 'general', name: 'General Practitioner' },
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'orthopedics', name: 'Orthopedics' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'psychiatry', name: 'Psychiatry' },
  { id: 'ophthalmology', name: 'Ophthalmology' }
];

// Define doctors
const doctors = [
  { 
    id: 1, 
    name: 'Dr. Sarah Johnson', 
    specialty: 'cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    rating: 4.9,
    reviews: 124,
    experience: '12 years'
  },
  { 
    id: 2, 
    name: 'Dr. Michael Chen', 
    specialty: 'general',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    rating: 4.7,
    reviews: 98,
    experience: '8 years'
  },
  { 
    id: 3, 
    name: 'Dr. Emily Rodriguez', 
    specialty: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    rating: 4.8,
    reviews: 156,
    experience: '15 years'
  },
  { 
    id: 4, 
    name: 'Dr. James Wilson', 
    specialty: 'dermatology',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    rating: 4.6,
    reviews: 87,
    experience: '10 years'
  },
  { 
    id: 5, 
    name: 'Dr. Olivia Thompson', 
    specialty: 'psychiatry',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    rating: 4.9,
    reviews: 112,
    experience: '11 years'
  }
];

// Define appointment types
const appointmentTypes = [
  { id: 'consultation', name: 'General Consultation', duration: '30 min', price: '$75' },
  { id: 'followup', name: 'Follow-up Visit', duration: '20 min', price: '$50' },
  { id: 'checkup', name: 'Annual Check-up', duration: '45 min', price: '$120' },
  { id: 'urgent', name: 'Urgent Care', duration: '30 min', price: '$95' }
];

const BookingPage = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    insurance: ''
  });
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Filter doctors based on selected specialty
  useEffect(() => {
    if (selectedSpecialty) {
      setFilteredDoctors(doctors.filter(doctor => doctor.specialty === selectedSpecialty));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedSpecialty]);

  // Generate a random booking reference when booking is complete
  useEffect(() => {
    if (bookingComplete) {
      const reference = 'HT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingReference(reference);
    }
  }, [bookingComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value: Value) => {
    setDate(value);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleDoctorSelect = (doctorId: number) => {
    setSelectedDoctor(doctorId);
  };

  const handleAppointmentTypeSelect = (typeId: string) => {
    setSelectedAppointmentType(typeId);
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log({
      date,
      timeSlot: selectedTimeSlot,
      doctor: doctors.find(d => d.id === selectedDoctor),
      appointmentType: appointmentTypes.find(t => t.id === selectedAppointmentType),
      patientInfo: formData
    });
    
    // Show booking confirmation
    setBookingComplete(true);
  };

  // Function to check if the current step is complete
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return selectedSpecialty && selectedDoctor !== null;
      case 2:
        return date !== null && selectedTimeSlot !== null && selectedAppointmentType !== '';
      case 3:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      default:
        return false;
    }
  };

  // Function to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render booking confirmation
  if (bookingComplete) {
    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
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
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="text-lg font-medium text-gray-900">{selectedDoctorData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment Type</p>
                    <p className="text-lg font-medium text-gray-900">{selectedAppointmentTypeData?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Please arrive 15 minutes before your appointment time. Bring your insurance card and a valid ID. 
                      If you need to cancel or reschedule, please do so at least 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link 
                  to="/"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Return to Home
                </Link>
                <button 
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Print Confirmation
                </button>
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
            Schedule a visit with our healthcare professionals in just a few simple steps.
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12" data-aos="fade-up">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step >= 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>Select Doctor</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <CalendarIcon className="h-5 w-5" />
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step >= 2 ? 'text-blue-600' : 'text-gray-500'
              }`}>Date & Time</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <Mail className="h-5 w-5" />
              </div>
              <span className={`mt-2 text-sm font-medium ${
                step >= 3 ? 'text-blue-600' : 'text-gray-500'
              }`}>Your Details</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
            {/* Step 1: Select Doctor */}
            {step === 1 && (
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Select a Doctor</h2>
                
                <div className="mb-6">
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <div 
                      key={doctor.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedDoctor === doctor.id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleDoctorSelect(doctor.id)}
                    >
                      <div className="flex flex-col sm:flex-row items-center">
                        <div className="flex-shrink-0 mb-4 sm:mb-0">
                          <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm" 
                          />
                        </div>
                        <div className="sm:ml-6 text-center sm:text-left">
                          <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">
                            {specialties.find(s => s.id === doctor.specialty)?.name}
                          </p>
                          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {doctor.experience} experience
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ★ {doctor.rating} ({doctor.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="ml-auto mt-4 sm:mt-0">
                          {selectedDoctor === doctor.id && (
                            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepComplete()}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      isStepComplete() 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Select Date and Time */}
            {step === 2 && (
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Date and Time</h2>
                
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
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepComplete()}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      isStepComplete() 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Next Step
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Patient Information */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Information</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Provider
                    </label>
                    <input
                      type="text"
                      name="insurance"
                      id="insurance"
                      value={formData.insurance}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please share any specific concerns or information that might be helpful for your appointment."
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ChevronLeft className="mr-2 h-5 w-5" />
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={!isStepComplete()}
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                      isStepComplete() 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Confirm Booking
                    <Check className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Summary Card (visible in steps 2 and 3) */}
        {(step === 2 || step === 3) && selectedDoctor !== null && (
          <div className="max-w-4xl mx-auto mt-8" data-aos="fade-up" data-aos-delay="100">
            <div className="bg-blue-50 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDoctor !== null && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium text-gray-900">{doctors.find(d => d.id === selectedDoctor)?.name}</p>
                    </div>
                  </div>
                )}
                
                {date instanceof Date && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{formatDate(date)}</p>
                    </div>
                  </div>
                )}
                
                {selectedTimeSlot && (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{selectedTimeSlot}</p>
                    </div>
                  </div>
                )}
                
                {selectedAppointmentType && (
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Appointment Type</p>
                      <p className="font-medium text-gray-900">
                        {appointmentTypes.find(t => t.id === selectedAppointmentType)?.name} 
                        {' '}
                        <span className="text-blue-600 font-semibold">
                          ({appointmentTypes.find(t => t.id === selectedAppointmentType)?.price})
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;

