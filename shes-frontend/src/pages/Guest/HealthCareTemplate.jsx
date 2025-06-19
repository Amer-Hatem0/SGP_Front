 import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
 
import img1 from '../../assets/images/about/img-1.jpg';
import img2 from '../../assets/images/about/img-2.jpg';
import img3 from '../../assets/images/about/img-3.jpg';
import logo from '../../assets/images/logo.png';
 import Header from '../../components/Header';
 import FeaturesSection from '../../components/FeaturesSection';
import Spinner from '../../components/Spinner';

 
function HealthCareTemplate() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  fetchData(); 
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
            <h1 className="mb-3 mt-3">Your most trusted health partner</h1>
            <p className="mb-4 pr-5">
              A repudiandae ipsam labore ipsa voluptatum quidem quae laudantium quisquam aperiam maiores sunt fugit, deserunt rem suscipit placeat.
            </p>
          
          </div>
        </div>
        {/* Add Features component here */}
       
      </div>
    </div>
  </section>

      {/* ========== Features Component ========== */}
<FeaturesSection />

      {/* ========== About Component ========== */}
      <section className="section about">
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
                  We provide best leading medical service Nulla perferendis veniam deleniti ipsum officia dolores repellat laudantium obcaecati neque.
                </p>
                <a href="/service" className="btn btn-main-2 btn-round-full btn-icon">
                  Services<i className="icofont-simple-right ml-3"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Stats Component ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta position-relative">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-doctor"></i>
                  <span className="h3">58</span>k
                  <p>Happy People</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-flag"></i>
                  <span className="h3">700</span>+
                  <p>Surgery Completed</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-badge"></i>
                  <span className="h3">40</span>+
                  <p>Expert Doctors</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="counter-stat">
                  <i className="icofont-globe"></i>
                  <span className="h3">20</span>
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
              <div className="section-title">
                <h2>Award winning patient care</h2>
                <div className="divider mx-auto my-4"></div>
                <p>
                  Let's know more el necessitatibus dolor asperiores illum possimus sint voluptates incidunt molestias nostrum laudantium. Maiores porro cumque quaerat.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                <div className="service-item mb-4">
                  <div className="icon d-flex align-items-center">
                    <i className="icofont-laboratory text-lg"></i>
                    <h4 className="mt-3 mb-3">Laboratory services</h4>
                  </div>
                  <div className="content">
                    <p className="mb-4">
                      Saepe nulla praesentium eaque omnis perferendis a doloremque.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Appointment Component ========== */}
      <section className="section appoinment">
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
                    <div className="col-lg-6">
                      <div className="form-group">
                        <select className="form-control" id="exampleFormControlSelect1">
                          <option>Choose Department</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <select className="form-control" id="exampleFormControlSelect2">
                          <option>Select Doctors</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input name="date" id="date" type="text" className="form-control" placeholder="dd/mm/yyyy" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input name="time" id="time" type="text" className="form-control" placeholder="Time" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input name="name" id="name" type="text" className="form-control" placeholder="Full Name" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input name="phone" id="phone" type="Number" className="form-control" placeholder="Phone Number" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group-2 mb-4">
                    <textarea name="message" id="message" className="form-control" rows="6" placeholder="Your Message"></textarea>
                  </div>
                  <a className="btn btn-main btn-round-full" href="/appoinment.html">
                    Make Appointment <i className="icofont-simple-right ml-2"></i>
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Footer Component ========== */}
      <footer className="footer section gray-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mr-auto col-sm-6">
              <div className="widget mb-5 mb-lg-0">
                <div className="logo mb-4">
                  <img src="/images/logo.png" alt="" className="img-fluid" />
                </div>
                <p>
                  Tempora dolorem voluptatum nam vero assumenda voluptate, facilis ad eos obcaecati tenetur veritatis eveniet distinctio possimus.
                </p>
                <ul className="list-inline footer-socials mt-4">
                  <li className="list-inline-item">
                    <a href="https://www.facebook.com/themefisher"> 
                      <i className="icofont-facebook"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://twitter.com/themefisher"> 
                      <i className="icofont-twitter"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://www.pinterest.com/themefisher/"> 
                      <i className="icofont-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="widget mb-5 mb-lg-0">
                <h4 className="text-capitalize mb-3">Department</h4>
                <div className="divider mb-4"></div>
                <ul className="list-unstyled footer-menu lh-35">
                  <li><a href="#">Surgery</a></li>
                  <li><a href="#">Wome's Health</a></li>
                  <li><a href="#">Radiology</a></li>
                  <li><a href="#">Cardioc</a></li>
                  <li><a href="#">Medicine</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="widget mb-5 mb-lg-0">
                <h4 className="text-capitalize mb-3">Support</h4>
                <div className="divider mb-4"></div>
                <ul className="list-unstyled footer-menu lh-35">
                  <li><a href="#">Terms & Conditions</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Company Support</a></li>
                  <li><a href="#">FAQ Questions</a></li>
                  <li><a href="#">Company Licence</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="widget widget-contact mb-5 mb-lg-0">
                <h4 className="text-capitalize mb-3">Get in Touch</h4>
                <div className="divider mb-4"></div>
                <div className="footer-contact-block mb-4">
                  <div className="icon d-flex align-items-center">
                    <i className="icofont-email mr-3"></i>
                    <span className="h6 mb-0">Support Available for 24/7</span>
                  </div>
                  <h4 className="mt-2"><a href="tel:+23-345-67890">Support@email.com</a></h4>
                </div>
                <div className="footer-contact-block">
                  <div className="icon d-flex align-items-center">
                    <i className="icofont-support mr-3"></i>
                    <span className="h6 mb-0">Mon to Fri : 08:30 - 18:00</span>
                  </div>
                  <h4 className="mt-2"><a href="tel:+23-345-67890">+23-456-6588</a></h4>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-btm py-4 mt-5">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-6">
                <div className="copyright">
                  &copy; Copyright Reserved to <span className="text-color">Novena</span> by{' '}
                  <a href="https://themefisher.com/"  target="_blank" rel="noopener noreferrer">
                    Themefisher
                  </a>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="subscribe-form text-lg-right mt-5 mt-lg-0">
                  <form action="#" className="subscribe">
                    <input type="text" className="form-control" placeholder="Your Email address" />
                    <a href="#" className="btn btn-main-2 btn-round-full">Subscribe</a>
                  </form>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <a className="backtop js-scroll-trigger" href="#top">
                  <i className="icofont-long-arrow-up"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HealthCareTemplate;