import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import { ClipLoader } from 'react-spinners';

export default function DoctorDetails() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Supervisor/Doctors`);
        const found = res.data.find(d => d.doctorId === parseInt(doctorId));
        if (found) {
          setDoctor(found);
        } else {
          console.error('Doctor not found');
        }
      } catch (error) {
        console.error('Error loading doctor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  return (
    <div>
      <Header />

      <section className="section doctor-details py-5">
        <div className="container">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
              <ClipLoader size={50} color="#007bff" />
            </div>
          ) : doctor ? (
            <div className="row justify-content-center mt-5 mb-5 pt-5 align-items-stretch">
            
              <div className="col-md-5 mb-4"  style={{
                    height: '300px',
                    
                  }}>
                <div
                  className="p-4 rounded shadow h-100 d-flex flex-column justify-content-center align-items-center"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <img
                    src={doctor.profileImage?.startsWith('data:image') ? doctor.profileImage : `${API_BASE_URL}${doctor.profileImage}`}
                    alt="Doctor"
                    className="img-fluid rounded-circle shadow mb-3"
                    style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                  />
                  <h5 className="text-secondary">{doctor.specialization}</h5>
                </div>
              </div>

             
              <div className="col-md-7" style={{
                    height: '300px',
                    
                  }}>
                <div
                  className="p-4 rounded shadow h-100 d-flex flex-column justify-content-between"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div>
                    <h3 className="text-primary mb-3">{doctor.fullName}</h3>
                    <p className="mb-2"><strong>Performance Score:</strong> {doctor.performanceScore}</p>
                    <p className="mb-2"><strong>Current Appointments:</strong> {doctor.workload}</p>
                    {doctor.email && (
                      <p className="mb-2"><strong>Email:</strong> {doctor.email}</p>
                    )}
                  </div>

                  <div className="mt-4 text-end">
                    <button
                      className="btn btn-success btn-lg px-4 fw-semibold"
                      style={{
                        fontFamily: 'Segoe UI, sans-serif',
                        fontSize: '1.05rem',
                        letterSpacing: '0.5px'
                      }}
                      onClick={() => navigate('/login')}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-danger">
              <p>Doctor not found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
