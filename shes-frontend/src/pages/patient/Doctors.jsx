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

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
  const today = new Date();

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (weekOffset * 7));
    const dayOfWeek = startOfWeek.getDay();
    const diffToSunday = startOfWeek.getDate() - dayOfWeek;
    const firstDayOfCurrentWeek = new Date(startOfWeek.setDate(diffToSunday));

    return daysOfWeek.map((day, index) => {
      const currentDate = new Date(firstDayOfCurrentWeek);
      currentDate.setDate(firstDayOfCurrentWeek.getDate() + index);
      const isPast =
        weekOffset === 0 && currentDate < new Date(today.setHours(0, 0, 0, 0));
      return {
        name: day.slice(0, 3),
        date: currentDate,
        disabled: isPast,
        active: selectedDay?.date?.toDateString() === currentDate.toDateString(),
        formatted: currentDate.toISOString().split('T')[0],
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
    setSelectedDay(null);
    setTimeSlots([]);
    setBookedTimes([]);
    setShowBookingModal(true);
  };

  // تحديد اليوم المطلوب وعرض الأوقات
  const handleDayClick = async (day) => {
    if (day.disabled) return;

    setSelectedDay(day);

    // توليد جميع الأوقات من 9:00 إلى 2:30
    const times = [];
    let current = new Date(day.date);
    current.setHours(9, 0, 0, 0);

    while (current.getHours() < 14 || (current.getHours() === 14 && current.getMinutes() <= 30)) {
      times.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30);
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      // استدعاء endpoint لجلب المواعيد المحجوزة
      const appointmentsRes = await axios.get(
        `${API_BASE_URL}/Appointment/GetDoctorAppointments/${bookingDoctorId}?date=${day.formatted}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // احفظ كل وقت محجوز كـ عدد دقائق منذ بداية اليوم
      const bookedTimes = appointmentsRes.data.map(a => {
        const d = new Date(a.dateTime);
        return d.getHours() * 60 + d.getMinutes();
      });
      setTimeSlots(times);
      setBookedTimes(bookedTimes);

    } catch (error) {
      console.error('Failed to fetch booked times:', error);
      setTimeSlots(times);
      setBookedTimes([]);
    }
  };

  // تأكيد الحجز
  const handleSubmit = (e, doctorId, selectedTime) => {
    e.preventDefault();
    setSelectedTimeForConfirm(selectedTime);
    setShowConfirmModal(true);
  };

  const confirmBooking = async () => {
    const doctorId = bookingDoctorId;
    const selectedTime = selectedTimeForConfirm;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userIdFromToken = parseInt(decoded.userId || decoded.sub);

      const patientRes = await axios.get(
        `${API_BASE_URL}/Patient/PatientIdByUserId/${userIdFromToken}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const actualPatientId = patientRes.data.patientId;

      const formattedDateTime = selectedTime.toISOString();

      await axios.post(
        `${API_BASE_URL}/Appointment/Book`,
        {
          doctorId,
          patientId: actualPatientId,
          dateTime: formattedDateTime,
          status: 'Pending',
          notes: 'Booked from patient panel',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // أضف وقت الحجز الجديد إلى قائمة المحجوزين بالدقائق
      setBookedTimes((prev) => [
        ...prev,
        selectedTime.getHours() * 60 + selectedTime.getMinutes()
      ]);
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
                <h6>Available Slots on {selectedDay.formatted}</h6>
                <div className="slots d-flex flex-wrap gap-2">
                  {timeSlots.map((slot, i) => {
                    const slotValue = slot.getHours() * 60 + slot.getMinutes();
                    const booked = bookedTimes.includes(slotValue);
                    return (
                      <button
                        key={i}
                        className={`slot-btn ${booked ? 'booked' : 'available'}`}
                        disabled={booked}
                        title={booked ? 'هذا الوقت محجوز بالفعل' : 'احجز هذا الوقت'}
                        onClick={(e) => !booked && handleSubmit(e, bookingDoctorId, slot)}
                      >
                        {booked ? 'Booked' : slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    );
                  })}
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
            <p>Are you sure you want to book this time?</p>
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
