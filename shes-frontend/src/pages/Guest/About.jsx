// AboutPage.jsx
import React from 'react';
  import Header from '../../components/Header';
    import Footer from '../../components/footer';

import sign from '../../assets/images/about/sign.png';
import about1 from '../../assets/images/about/about-1.jpg';
 import about2 from '../../assets/images/about/about-2.jpg';
 import about3 from '../../assets/images/about/about-3.jpg';
 import about4 from '../../assets/images/about/about-4.jpg';
 import team1 from '../../assets/images/team/1.jpg';
  import team2 from '../../assets/images/team/2.jpg';
   import team3 from '../../assets/images/team/3.jpg';
    import team4 from '../../assets/images/team/4.jpg';
 
 

  
const AboutPage = () => {
  return (
    <div id="top" className="AboutPage">
      {/* Header */}
   <Header />

      {/* Page Title */}
      <section className="page-title bg-1">
        <div className="overlay"></div>
        <div className="container AboutUs">
          <div className="row">
            <div className="col-md-12">
              <div className="block text-center AboutUs">
                <span className="text-white  ">About Us</span>
                <h1 className="text-capitalize mb-5 text-lg">About Us</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section about-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <h2 className="title-color">Personal care for your healthy living</h2>
            </div>
            <div className="col-lg-8">
              <p>
            Our Smart Hospital Enhancement System (SHES) leverages AI-driven tools to improve scheduling, reduce delays, and provide patients with accurate preliminary diagnoses — all while maintaining efficiency and transparency across hospital operations  </p>
              <img src={sign} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="fetaure-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item mb-5 mb-lg-0">
                <img src={about1} alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Healthcare for Kids</h4>
                <p>Our team ensures your child’s health with personalized treatment plans.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item mb-5 mb-lg-0">
                <img src={about2}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Medical Counseling</h4>
                <p>Get expert medical advice from qualified professionals at every step.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item mb-5 mb-lg-0">
                <img src={about3}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Modern Equipments</h4>
                <p>Our hospital is equipped with the latest diagnostic and surgical technologies.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item">
                <img src={about4}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Qualified Doctors</h4>
                <p>Every patient receives care from experts in their specific medical condition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

   

      {/* Testimonials Section */}
      <section className="section testimonial mt-5 pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-6">
              <div className="section-title">
                <h2 className="mb-4">What they say about us</h2>
                <div className="divider my-4"></div>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-6 testimonial-wrap offset-lg-6">
              <div className="testimonial-block">
                <div className="client-info">
                  <h4>Amazing service!</h4>
                  <span>John Partho</span>
                </div>
                <p>
                 At our facility, we are dedicated to providing exceptional medical services that prioritize patient well-being, accuracy in diagnosis, and efficiency in treatment. With a team of skilled professionals and a patient-centered approach, we ensure that every individual receives comprehensive care, emotional support, and access to modern healthcare technologies — creating a safe and trustworthy environment for all
                </p>
                <i className="icofont-quote-right"></i>
              </div>
            
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
   <Footer />
    </div>
  );
};

export default AboutPage;