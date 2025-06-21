import React from 'react';
import logo from '../assets/images/logo2.png'
import { FaFacebookF,FaInstagram ,FaWhatsapp  } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="footer section gray-bg">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-lg-4 mr-auto col-sm-6">
            <div className="widget mb-5 mb-lg-0">
              <div className="logof mb-4">
                <img src={logo} alt="Logo" className="img-fluid logofooter" />
              </div>
              <p>
           We are dedicated to providing reliable, compassionate healthcare services supported by innovation, integrity, and excellence — because your health matters   </p>
              <ul className="list-inline footer-socials mt-4">
                <li className="list-inline-item p-2 me-5">
                  <FaFacebookF size={20} color="#3b5998" />
                </li>
                <li className="list-inline-item p-2 me-5">
               <FaInstagram size={20} color="#3b5998" />
                </li>
                <li className="list-inline-item p-2 me-5">
                  <FaWhatsapp size={20} color="#3b5998" />
                </li>
              </ul>
            </div>
          </div>

          {/* Department Links */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <div className="widget mb-5 mb-lg-0">
              <h4 className="text-capitalize mb-3">Department</h4>
              <div className="divider mb-4"></div>
              <ul className="list-unstyled footer-menu lh-35">
                <li><p href="#">Surgery</p></li>
                <li><p href="#">Wome's Health</p></li>
                <li><p href="#">Radiology</p></li>
                <li><p href="#">Cardioc</p></li>
                <li><p href="#">Medicine</p></li>
              </ul>
            </div>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <div className="widget mb-5 mb-lg-0">
              <h4 className="text-capitalize mb-3">Support</h4>
              <div className="divider mb-4"></div>
              <ul className="list-unstyled footer-menu lh-35">
                <li><p href="#">Terms & Conditions</p></li>
                <li><p href="#">Privacy Policy</p></li>
                <li><p href="#">Company Support</p></li>
                <li><p href="#">FAQ Questions</p></li>
                <li><p href="#">Company Licence</p></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
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
           
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-btm py-4 mt-5">
          <div className="row align-items-center justify-content-between">
          
            <div className="col-lg-5">
              <div className="subscribe-form text-lg-right mt-5 mt-lg-0">
              <p className="btn btn-main-2 btn-round-full">
  © 2025 <span className="text-success">SHES</span> – All Rights Reserved.
</p>

                
              </div>
            </div>
            <div className="col-lg-4">
              <div className="subscribe-form text-lg-right mt-5 mt-lg-0">
               
                <form action="#" className="subscribe">
                  <input type="text" className="form-control" placeholder="Your Email address" />
                  <p href="#" className="btn   btn-round-full aaaaaaaaaaaaaaaaaa ">Subscribe</p>
                </form>
              </div>
            </div>
          </div>

          {/* Back to Top */}
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
  );
};

export default Footer;