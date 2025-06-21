 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import API_BASE_URL from '../../config/apiConfig';
import Spinner from '../../components/Spinner';
export default function ManageAppointments() {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [message, setMessage] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [leaveDays, setLeaveDays] = useState([]);
const getStatusLabel = (statusID) => {
  switch (statusID) {
    case 1: return 'Pending';
    case 2: return 'Scheduled';
    case 3: return 'Completed';
    case 4: return 'Canceled';
    case 5: return 'Rescheduled';
    default: return 'Unknown';
  }
};
const generateWeekOptions = () => {
  const options = [];
  for (let i = 0; i <= 4; i++) {  
    const start = new Date();
    start.setDate(start.getDate() + (i * 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    options.push({
      label: `Week ${i + 1}: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      value: i
    });
  }
  return options;
};
const weekOptions = generateWeekOptions();

const getStatusColor = (statusID) => {
  switch (statusID) {
    case 1: return 'info';
    case 2: return 'primary';
    case 3: return 'success';
    case 4: return 'danger';
    case 5: return 'warning text-dark';
    default: return 'secondary';
  }
};

useEffect(() => {
  if (selectedDoctor) {
    axios.get(`${API_BASE_URL}/Doctor/LeaveRequests/${selectedDoctor}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setLeaveDays(res.data))
      .catch(err => {
        console.error('Error fetching leave days:', err);
        setLeaveDays([]);
      });
  }
}, [selectedDoctor]);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
  const today = new Date();

 const generateWeekDays = () => {
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + (weekOffset * 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const dayOfWeek = startOfWeek.getDay();
  const firstDayOfCurrentWeek = new Date(startOfWeek);
  firstDayOfCurrentWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  return daysOfWeek.map((day, index) => {
    const currentDate = new Date(firstDayOfCurrentWeek);
    currentDate.setDate(firstDayOfCurrentWeek.getDate() + index);
    currentDate.setHours(0, 0, 0, 0);

    const isPast = currentDate < new Date().setHours(0, 0, 0, 0);

    // ✅ هل اليوم ضمن فترة إجازة؟
    const isLeaveDay = leaveDays.some(l => {
      const start = new Date(l.startDate).setHours(0, 0, 0, 0);
      const end = new Date(l.endDate).setHours(23, 59, 59, 999);
      return currentDate.getTime() >= start && currentDate.getTime() <= end;
    });

    return {
      name: day.slice(0, 3),
      date: currentDate,
      disabled: isPast || isLeaveDay,
      leave: isLeaveDay,
      active: selectedDay?.date?.toDateString() === currentDate.toDateString(),
      formatted: currentDate.toISOString().split('T')[0],
    };
  });
};

  const [weekDays, setWeekDays] = useState(generateWeekDays());

useEffect(() => {
  setWeekDays(generateWeekDays());
}, [weekOffset, leaveDays, selectedDay]);


  useEffect(() => {
    fetchAllData();
  }, []);

 const fetchAllData = async () => {
  try {
    setIsLoading(true);  

    const [p, d, a, r] = await Promise.all([
      axios.get(`${API_BASE_URL}/Supervisor/VerifiedPatients`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/Supervisor/Doctors`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/Supervisor/Appointments`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/Supervisor/RescheduleRequests`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    setPatients(p.data);
    setDoctors(d.data);
    setAppointments(a.data);
    setRescheduleRequests(r.data);
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    setIsLoading(false); // إنهاء التحميل
  }
};


  const handleDayClick = async (day) => {
    if (day.disabled || !selectedDoctor) return;

    setSelectedDay(day);
    setTimeSlots([]);
    setBookedTimes([]);

    const times = [];
    let current = new Date(day.date);
    current.setHours(9, 0, 0, 0);
    while (current.getHours() < 14 || (current.getHours() === 14 && current.getMinutes() <= 30)) {
      times.push(new Date(current));
      current.setMinutes(current.getMinutes() + 30);
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/Appointment/GetDoctorAppointments/${selectedDoctor}?date=${day.formatted}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookedFormatted = res.data.map(a => {
        const d = new Date(a.dateTime);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
      });

      setTimeSlots(times);
      setBookedTimes(bookedFormatted);
    } catch (err) {
      console.error('Failed to fetch booked times:', err);
      setTimeSlots(times);
      setBookedTimes([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedTime) return;

    const adjustedDate = new Date(selectedTime);
    adjustedDate.setDate(adjustedDate.getDate() - 1);
    const formattedDateTime = new Date(adjustedDate.getTime() - adjustedDate.getTimezoneOffset() * 60000).toISOString();

    try {
  await axios.post(`${API_BASE_URL}/Supervisor/AssignPatient`, {
  patientId: parseInt(selectedPatient),
  doctorId: parseInt(selectedDoctor),
  dateTime: formattedDateTime,
  status: 'Pending',
  notes: 'Booked by supervisor'
}, { headers: { Authorization: `Bearer ${token}` } });


      setMessage('✅ Patient assigned successfully!');
      setSelectedPatient('');
      setSelectedDoctor('');
      setSelectedTime(null);
      setSelectedDay(null);
      fetchAllData();
    } catch (err) {
      console.error('Error assigning patient:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/Supervisor/ApproveReschedule/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve request.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/Supervisor/RejectReschedule/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to reject request.');
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
    <SupervisorSidebar isOpen={true} />
     {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner message="Loading appointments..." />
        </div>
      ) : ( 
      <div className="container mt-5">
    
        <div className="row">
          {/* Add Appointment Section */}
          <div className="col-md-5">
            <div className="card shadow p-4 mb-4">
              <h5 className="fw-bold mb-3">New Appointment</h5>
              {message && <div className="alert alert-success">{message}</div>}
              {/* patient select */}
              <div className="mb-3">
                <label className="form-label">Patient</label>
                <select className="form-select" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                  ))}
                </select>
              </div>
              {/* doctor select */}
              <div className="mb-3">
                <label className="form-label">Doctor</label>
                <select className="form-select" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>{d.fullName} - {d.specialization}</option>
                  ))}
                </select>
              </div>
              {/* week day selector */}
       <div className="mb-3">
  <label className="form-label">Select Week</label>
  <select
    className="form-select mb-2"
    value={weekOffset}
    onChange={(e) => setWeekOffset(Number(e.target.value))}
  >
    {weekOptions.map((opt, i) => (
      <option key={i} value={opt.value}>{opt.label}</option>
    ))}
  </select>

  <div className="d-flex flex-wrap gap-2">
    {weekDays.map((day, i) => (
      <button
        key={i}
        className={`btn btn-sm ${
          day.disabled
            ? day.leave
              ? 'btn-outline-danger'
              : 'btn-outline-secondary'
            : day.active
            ? 'btn-primary'
            : 'btn-outline-primary'
        }`}
        disabled={day.disabled}
        onClick={() => handleDayClick(day)}
      >
        {day.name} <br /> {day.date.getDate()}
      </button>
    ))}
  </div>
</div>


              {/* times */}
              {selectedDay && (
                <div className="mb-3">
                  <label className="form-label">Available Times</label>
                  <div className="d-flex flex-wrap gap-2">
                    {timeSlots.map((slot, i) => {
                      const h = slot.getHours().toString().padStart(2, '0');
                      const m = slot.getMinutes().toString().padStart(2, '0');
                      const str = `${h}:${m}`;
                      const booked = bookedTimes.includes(str);
                      return (
                        <button
                          key={i}
                          className={`btn btn-sm ${booked
                            ? 'btn-danger'
                            : selectedTime?.getTime() === slot.getTime()
                              ? 'btn-success'
                              : 'btn-outline-primary'
                            }`}
                          disabled={booked}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {str} {booked && ' (Booked)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <button className="btn btn-primary w-100" onClick={handleAssign}>Add Appointment</button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="col-md-7">
            <div className="card shadow p-4 mb-4">
              <h5 className="fw-bold mb-3">All Appointments</h5>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{a.patientName}</td>
                      <td>{a.doctorName}</td>
                      <td>{new Date(new Date(a.appointmentDate).setDate(new Date(a.appointmentDate).getDate() + 1)).toLocaleString()}</td>
                     <td>
  <span className={`badge bg-${getStatusColor(a.statusID)}`}>
    {getStatusLabel(a.statusID)}
  </span>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reschedule Requests */}
          <div className="col-md-12">
            <div className="card shadow p-4">
              <h5 className="fw-bold mb-3">Pending Reschedule Requests</h5>
              {rescheduleRequests.length === 0 ? (
                <p className="text-muted">No pending requests.</p>
              ) : (
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Appointment ID</th>
                      <th>New Date</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rescheduleRequests.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.doctorName}</td>
                        <td>{r.appointmentId}</td>
                        <td>{new Date(r.requestedDateTime).toLocaleString()}</td>
                        <td>{r.reason}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleApprove(r.id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(r.id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>  )}
  
  </>
);

}
