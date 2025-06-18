import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientDashboard.css';
import API_BASE_URL from '../../config/apiConfig';
import PatientNavbar from '../../components/PatientNavbar';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTimeForConfirm, setSelectedTimeForConfirm] = useState(null);

  // أيام الأسبوع (من الأحد للسبت ما عدا الجمعة كما في الكود الأصلي)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
  const today = new Date();

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (weekOffset * 7));
    // Set to start of day to ensure consistent comparison for "isPast"
    startOfWeek.setHours(0, 0, 0, 0); 
    const dayOfWeek = startOfWeek.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Adjust startOfWeek to be the first day (Sunday) of the current logical week
    // This correctly handles cases where `today` is not Sunday.
    const firstDayOfCurrentWeek = new Date(startOfWeek);
    firstDayOfCurrentWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    return daysOfWeek.map((day, index) => {
      const currentDate = new Date(firstDayOfCurrentWeek);
      currentDate.setDate(firstDayOfCurrentWeek.getDate() + index);
      
      // Check if the current date is in the past compared to today (start of today)
      const isPast = currentDate.setHours(0,0,0,0) < today.setHours(0,0,0,0); 

      return {
        name: day.slice(0, 3), // e.g., "Sun", "Mon"
        date: currentDate,
        disabled: isPast,
        active: selectedDay?.date?.toDateString() === currentDate.toDateString(),
        formatted: currentDate.toISOString().split('T')[0], // e.g., "2025-06-18"
      };
    });
  };

  const [weekDays, setWeekDays] = useState(generateWeekDays());

  useEffect(() => {
    setWeekDays(generateWeekDays());
  }, [weekOffset]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await axios.get(`${API_BASE_URL}/Patient/Doctors`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  // Handle Book button click
  const handleBookClick = (doctorId) => {
    setBookingDoctorId(doctorId);
    setSelectedDay(null); // Reset selected day
    setTimeSlots([]); // Clear time slots
    setBookedTimes([]); // Clear booked times
    setShowBookingModal(true);
  };

  const handleDayClick = async (day) => {
    if (day.disabled) return;

    setSelectedDay(day);
    setTimeSlots([]); // Clear previous slots while loading
    setBookedTimes([]); // Clear previous booked times while loading

    const times = [];
    let current = new Date(day.date);
    current.setHours(9, 0, 0, 0); // Start at 9:00 AM

    // Generate time slots from 9:00 AM to 2:30 PM (14:30)
    while (current.getHours() < 14 || (current.getHours() === 14 && current.getMinutes() <= 30)) {
      times.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30); // Increment by 30 minutes
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      const appointmentsRes = await axios.get(
        `${API_BASE_URL}/Appointment/GetDoctorAppointments/${bookingDoctorId}?date=${day.formatted}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

const bookedTimesFormatted = appointmentsRes.data.map(a => {
  const d = new Date(a.dateTime);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`; // مثال: "14:30"
});



      setTimeSlots(times);
      setBookedTimes(bookedTimesFormatted); // Store the formatted booked times

    } catch (error) {
      console.error('Failed to fetch booked times:', error);
      setTimeSlots(times);
      setBookedTimes([]); // In case of error, treat no times as booked
    }
  };

  // تأكيد الحجز - Prepare for confirmation modal
  const handleSubmit = (e, doctorId, selectedTime) => {
    e.preventDefault();
    setSelectedTimeForConfirm(selectedTime);
    setShowConfirmModal(true);
  };

  // Execute the booking after confirmation
  const confirmBooking = async () => {
    const doctorId = bookingDoctorId;
    const selectedTime = selectedTimeForConfirm; // This is a Date object (local time)

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      // Extract userId from token (assuming token is JWT)
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userIdFromToken = parseInt(decoded.userId || decoded.sub);

      // Fetch PatientId using UserId
      const patientRes = await axios.get(
        `${API_BASE_URL}/Patient/PatientIdByUserId/${userIdFromToken}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const actualPatientId = patientRes.data.patientId;

      // Convert selectedTime (local Date object) to ISO string (UTC) for backend
const adjustedDate = new Date(selectedTime);
adjustedDate.setDate(adjustedDate.getDate() - 1); // 🔴 خصم يوم كامل
const formattedDateTime = new Date(adjustedDate.getTime() - adjustedDate.getTimezoneOffset() * 60000).toISOString();



      await axios.post(
        `${API_BASE_URL}/Appointment/Book`,
        {
          doctorId,
          patientId: actualPatientId,
          dateTime: formattedDateTime, // Send as UTC ISO string
          status: 'Pending',
          notes: 'Booked from patient panel',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the newly booked time to the list of booked times (in local 'HH:MM' format)
      setBookedTimes((prev) => [
        ...prev,
        selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      ]);

      // Close modals and reset
      setShowConfirmModal(false);
      setSelectedTimeForConfirm(null);
      setShowBookingModal(false);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const goToPreviousWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1);
  };

  const goToNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  return (
    <>
      <PatientNavbar />
      <div className="patient-container-full">
        <main className="doctor-main">
          <h2 className="doctor-title">Available Doctors</h2>
          <div className="doctor-grid">
            {doctors.map((doc, index) => (
              <div key={index} className="doctor-card">
                <div className="doctor-initial-avatar">
                  {doc.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="doctor-info">
                  <h3>{doc.fullName}</h3>
                  <p><strong>Specialization:</strong> {doc.specialization || 'N/A'}</p>
                  <p><strong>Gender:</strong> {doc.gender || 'Not specified'}</p>
                  <p><strong>Email:</strong> {doc.email}</p>
                </div>
                <button
                  className="doctor-book-btn"
                  onClick={() => handleBookClick(doc.doctorId)}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal-content-lg">
            <h4 className="mb-3">Select Appointment Time</h4>

            {/* Week navigation */}
            <div className="week-navigation mb-3 d-flex justify-content-between">
              <button onClick={goToPreviousWeek} disabled={weekOffset === 0} className="btn btn-sm btn-primary">&larr;</button>
              <span>
                {new Date(weekDays[0].date).toLocaleDateString()} - {new Date(weekDays[5].date).toLocaleDateString()}
              </span>
              <button onClick={goToNextWeek} className="btn btn-sm btn-primary">&rarr;</button>
            </div>

            {/* Days of the week */}
            <div className="days-of-week d-flex gap-2 flex-wrap mb-3">
              {weekDays.map((day, i) => (
                <button
                  key={i}
                  className={`day-card ${day.disabled ? 'disabled' : ''} ${day.active ? 'active' : ''}`}
                  onClick={() => handleDayClick(day)}
                  disabled={day.disabled}
                >
                  {day.name} <br /> <small>{day.date.getDate()}</small>
                </button>
              ))}
            </div>

            {/* Available time slots */}
            {selectedDay && (
              <div>
                <h6>Available Slots on {selectedDay.date.toLocaleDateString()}</h6> {/* Display full formatted date */}
                <div className="slots d-flex flex-wrap gap-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, i) => {
                      // Get the time string in HH:MM format for comparison
                    const hours = slot.getHours().toString().padStart(2, '0');
const minutes = slot.getMinutes().toString().padStart(2, '0');
const slotStr = `${hours}:${minutes}`;
  const booked = bookedTimes.includes(slotStr);
                      
                      return (
                        <button
                          key={i}
                          className={`slot-btn ${booked ? 'booked' : 'available'}`}
                          disabled={booked}
                          title={booked ? 'This time is already booked' : 'Book this time'}
                          onClick={(e) => !booked && handleSubmit(e, bookingDoctorId, slot)}
                        >
                        {slotStr}
  {booked && <span style={{ marginLeft: '5px', fontWeight: 'bold' }}> (محجوز)</span>}
                        </button>
                      );
                    })
                  ) : (
                    <p>No time slots available for this day, or still loading.</p>
                  )}
                </div>

              </div>
            )}

            <button className="btn btn-outline-danger mt-4" onClick={() => setShowBookingModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>Confirm Booking</h5>
            <p>Are you sure you want to book an appointment for {selectedTimeForConfirm?.toLocaleDateString()} at {selectedTimeForConfirm?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}?</p>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={confirmBooking}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal + Slot Style */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content, .modal-content-lg {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
        }
        .slot-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          min-width: 90px;
          transition: all 0.2s ease;
          background-color: #e9ecef;
          color: #333;
          display: flex; /* Added for better alignment of text and "محجوز" */
          align-items: center; /* Added for better alignment */
          justify-content: center; /* Added for better alignment */
        }
        .slot-btn.available:hover {
          background-color: #28a745;
          color: white;
        }
        .slot-btn.booked {
          background-color: #dc3545 !important;
          color: white !important;
          text-decoration: line-through;
          font-style: italic;
          cursor: not-allowed;
          opacity: 0.9;
        }
        .slot-btn.selected {
          background-color: #0d6efd;
          color: white;
        }
        .day-card {
          padding: 10px;
          min-width: 60px;
          text-align: center;
          border-radius: 6px;
          background-color: #f8f9fa;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        .day-card.active {
          background-color: #007bff;
          color: white;
        }
        .day-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}