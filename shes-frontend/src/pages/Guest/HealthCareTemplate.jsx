import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';

import img1 from '../../assets/images/about/img-1.jpg';
import img2 from '../../assets/images/about/img-2.jpg';
import img3 from '../../assets/images/about/img-3.jpg';
import logo from '../../assets/images/logo.png';
import Header from '../../components/Header';
import FeaturesSection from '../../components/FeaturesSection';
import Spinner from '../../components/Spinner';
 import Footer from '../../components/footer';

function HealthCareTemplate() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);
useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
  });
}, []);

  const fetchData = async () => {
    try {
      setLoading(true);

    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  if (loading) return <Spinner />;

  return (

    <div className="App">
      {/* ========== Header Component ========== */}
      <Header />

      {/* ========== Banner Component ========== */}
      <section className="banner">
        <div className="container">
          <div className="row">
            {/* Add the background image */}
            <div className="col-lg-6 col-md-12 col-xl-7 banner-content">
              <div className="block">
                <div className="divider mb-3"></div>
                <span className="text-uppercase text-sm letter-spacing">
                  Total Health care solution
                </span>
                <h1 className="mb-3 mt-3">Where Healing Begins and Hope Never Ends</h1>
                <p className="mb-4 pr-5">
                  We are committed to delivering exceptional, patient-centered care through innovation, compassion, and expertise — ensuring your health is always our priority    </p>

              </div>
            </div>


          </div>
        </div>
      </section>

      {/* ========== Features Component ========== */}
      <FeaturesSection data-aos="fade-right" />

      {/* ========== About Component ========== */}
     <section className="section about" data-aos="fade-right">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 col-sm-6">
              <div className="about-img">
                <img src={img1} alt="" className="img-fluid" />
                <img src={img2} alt="" className="img-fluid mt-4" />
              </div>
            </div>
            <div className="col-lg-4 col-sm-6">
              <div className="about-img mt-4 mt-lg-0">
                <img src={img3} alt="" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="about-content pl-4 mt-4 mt-lg-0">
                <h2 className="title-color">Personal care <br />& healthy living</h2>
                <p className="mt-4 mb-5">
                  We provide best leading medical service No one carries the pardon of the delectable, the office of pains repels the praise of the blinded, nor does it.
                </p>
                
                   <Link to="/services" className="btn btn-main btn-round-full aaaaaaaaaaaaaaaaaa">
                  Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Stats Component ========== */}
<section className="cta-section" data-aos="fade-up">
  <div className="container">
    <div className="cta position-relative">
      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="counter-stat">
            <i className="icofont-doctor"></i>
            <span className="h3">
              <CountUp end={58} duration={4} />k
            </span>
            <p>Happy People</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="counter-stat">
            <i className="icofont-flag"></i>
            <span className="h3">
              <CountUp end={700} duration={5} />+
            </span>
            <p>Surgery Completed</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="counter-stat">
            <i className="icofont-badge"></i>
            <span className="h3">
              <CountUp end={40} duration={4} />+
            </span>
            <p>Expert Doctors</p>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 col-sm-6">
          <div className="counter-stat">
            <i className="icofont-globe"></i>
            <span className="h3">
              <CountUp end={20} duration={3.5} />
            </span>
            <p>Worldwide Branch</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* ========== Services Component ========== */}
<section className="section service gray-bg">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-7 text-center">
        <div className="section-title" data-aos="fade-up">
          <h2>Award winning patient care</h2>
          <div className="divider mx-auto my-4"></div>
          <p>
            We are committed to delivering exceptional medical services using modern technologies, compassionate staff, and continuous innovation for better health outcomes.
          </p>
        </div>
      </div>
    </div>

    <div className="row">
      
      {[
        { icon: '🫀', title: 'Cardiology', text: 'Advanced heart care and diagnostics to keep your heart strong and healthy.' },
        { icon: '🧠', title: 'Neurology', text: 'Expert diagnosis and care for neurological conditions and disorders.' },
        { icon: '👶', title: 'Pediatrics', text: 'Comprehensive healthcare services for infants, children, and adolescents.' },
        { icon: '😁', title: 'Dental Care', text: 'Full range of dental treatments with a focus on comfort and hygiene.' },
        { icon: '🩻', title: 'Radiology', text: 'High-tech imaging services including X-rays, CT scans, and MRIs.' },
        { icon: '🧪', title: 'Laboratory', text: 'Accurate diagnostic tests and reports with fast turnaround times.' },
      ].map((service, index) => (
        <div
          className="col-lg-4 col-md-6 col-sm-6"
          key={index}
          data-aos="zoom-in-up"
          data-aos-delay={index * 150}
        >
          <div className="service-item mb-4">
            <div className="icon d-flex align-items-center">
              <p className="contact-i">{service.icon}</p>
              <h4 className="mt-3 mb-3">{service.title}</h4>
            </div>
            <div className="content">
              <p className="mb-4">{service.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      {/* ========== Appointment Component ========== */}
    <section className="section appoinment" data-aos="zoom-in">

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="appoinment-content">
                <img src={img3} alt="" className="img-fluid" />

              </div>
            </div>
            <div className="col-lg-6 col-md-10">
              <div className="appoinment-wrap mt-5 mt-lg-0">
                <h2 className="mb-2 title-color">Book appointment</h2>
                <p className="mb-4">
                  Mollitia dicta commodi est recusandae iste, natus eum asperiores corrupti qui velit . Iste dolorum atque similique praesentium soluta.
                </p>
                <form id="#" className="appoinment-form" method="post" action="#">
                  <div className="row">
                    <div className="col-lg-6 mt-2">
                      
                        <div className="form-group">
                        <input name="date" id="date" type="text" disabled className="form-control" placeholder="Choose Department" />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                      
                       <div className="form-group">
                        <input name="date" id="date" type="text" disabled className="form-control" placeholder="Select Doctors" />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                      <div className="form-group">
                        <input name="date" id="date" type="text" disabled className="form-control" placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                      <div className="form-group">
                        <input name="time" id="time" type="text" disabled className="form-control" placeholder="Time" />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                      <div className="form-group">
                        <input name="name" id="name" type="text" disabled className="form-control" placeholder="Full Name" />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-2">
                      <div className="form-group">
                        <input name="phone" id="phone" type="Number"disabled className="form-control" placeholder="Phone Number" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group-2  mt-2 mb-4">
                    <textarea name="message" id="message"disabled className="form-control" rows="6" placeholder="Your Message"></textarea>
                  </div>
                    <Link to="/login" className="btn  btn-main btn-round-full aaaaaaaaaaaaaaaaaa">
                  Make an appointment
                </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Footer Component ========== */}
       <Footer />
    </div>
  );
}

export default HealthCareTemplate;