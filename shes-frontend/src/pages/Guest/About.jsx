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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, quod laborum alias.
                Vitae dolorum, officia sit! Saepe ullam facere at, consequatur incidunt, quae esse, quis
                ut reprehenderit dignissimos, libero delectus.
              </p>
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
                <p>Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item mb-5 mb-lg-0">
                <img src={about2}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Medical Counseling</h4>
                <p>Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item mb-5 mb-lg-0">
                <img src={about3}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Modern Equipments</h4>
                <p>Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="about-block-item">
                <img src={about4}  alt="" className="img-fluid w-100" />
                <h4 className="mt-3">Qualified Doctors</h4>
                <p>Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center">
                <h2 className="mb-4">Meet Our Specialist</h2>
                <div className="divider mx-auto my-4"></div>
                <p>
                  Today’s users expect effortless experiences. Don’t let essential people and
                  processes stay stuck in the past. Speed it up, skip the hassles
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="team-block mb-5 mb-lg-0">
                <img src={team1} alt="" className="img-fluid w-100" />
                <div className="content">
                  <h4 className="mt-4 mb-0">
                    <a href="/doctor-single">John Marshal</a>
                  </h4>
                  <p>Internist, Emergency Physician</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="team-block mb-5 mb-lg-0">
                <img src={team2} alt="" className="img-fluid w-100" />
                <div className="content">
                  <h4 className="mt-4 mb-0">
                    <a href="/doctor-single">Marshal Root</a>
                  </h4>
                  <p>Surgeon, Cardiologist</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="team-block mb-5 mb-lg-0">
                <img src={team3} alt="" className="img-fluid w-100" />
                <div className="content">
                  <h4 className="mt-4 mb-0">
                    <a href="/doctor-single">Siamon john</a>
                  </h4>
                  <p>Internist, General Practitioner</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="team-block">
                <img src={team4} alt="" className="img-fluid w-100" />
                <div className="content">
                  <h4 className="mt-4 mb-0">
                    <a href="/doctor-single">Rishat Ahmed</a>
                  </h4>
                  <p>Orthopedic Surgeon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonial">
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
                  They provide great service facility consectetur adipisicing elit. Itaque rem,
                  praesentium, iure, ipsum magnam deleniti a vel eos adipisci suscipit fugit placeat.
                  Quibusdam laboriosam eveniet nostrum nemo commodi numquam quod.
                </p>
                <i className="icofont-quote-right"></i>
              </div>
              {/* كرر العناصر حسب الحاجة */}
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