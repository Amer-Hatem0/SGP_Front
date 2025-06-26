import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import API_BASE_URL from '../../config/apiConfig';
import { Link } from 'react-router-dom';
const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Supervisor/Doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  return (
    <div id="top">
      <Header />
      {/* --- Page Title --- */}
      <section className="page-title bg-1">
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="block text-center">
                <span className="text-white">All Doctors</span>
                <h1 className="text-capitalize mb-5 text-lg">Specialized doctors</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Doctors Section --- */}
      <section className="section doctors">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="section-title">
                <h2>Doctors</h2>
                <div className="divider mx-auto my-4"></div>
                <p>
                  We provide a wide range of creative services adipisicing elit. Autem maxime rem modi eaque, voluptate. Beatae officiis neque
                </p>
              </div>
            </div>
          </div>

          <div className="row shuffle-wrapper portfolio-gallery">
            {doctors.map((doctor, index) => (
            <DoctorCard
  key={index}
 doctorId={doctor.doctorId}

  image={doctor.profileImage || "/images/team/1.jpg"}
  name={doctor.fullName || 'Doctor Name'}
  specialty={doctor.specialization || 'General Medicine'}
  category='["cat1"]'
/>

            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="section cta-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="cta-content">
                <div className="divider mb-4"></div>
                <h2 className="mb-5 text-lg">
                  We are pleased to offer you the{' '}
                  <span className="title-color">chance to have the healthy</span>
                </h2>
                <Link to="/login" className="btn btn-main btn-round-full aaaaaaaaaaaaaaaaaa">
                  Make an appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

// Doctor Card Component
const DoctorCard = ({ image, name, specialty, category, doctorId }) => {

  return (
    <div className="col-lg-3 col-sm-6 col-md-6 mb-4 shuffle-item" data-groups={category}>
      <div className="position-relative doctor-inner-box">
        <div className="doctor-profile">
          <div className="doctor-img">
            <img 
              src={image.startsWith('data:image') ? image : `${API_BASE_URL}${image}`} 
              alt="doctor" 
              className="img-fluid w-100" 
            />
          </div>
        </div>
        <div className="content mt-3">
          <h4 className="mb-0">
        
  <Link to={`/doctor-details/${doctorId}`} className="text-decoration-none text-dark">
    {name}
  </Link>
 

          </h4>
          <p>{specialty}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;