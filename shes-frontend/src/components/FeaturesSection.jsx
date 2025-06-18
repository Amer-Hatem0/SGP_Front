import React from 'react';
import { Link } from 'react-router-dom';

// استيراد الأيقونات من React Icons
import { BsCalendarCheck } from 'react-icons/bs'; // Online Appointment
import { FaClock } from 'react-icons/fa';         // Working Hours
import { MdSupportAgent } from 'react-icons/md';  // Emergency Support

const FeaturesSection = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="feature-block d-lg-flex justify-content-between">
              
              {/* Feature 1: Online Appointment */}
              <div className="feature-item mb-5 mb-lg-0">
                <div className="feature-icon mb-4 text-primary">
                  <BsCalendarCheck size={40} />
                </div>
                <span>24 Hours Service</span>
                <h4 className="mb-3">Online Appointment</h4>
                <p className="mb-4">
                  Get All time support for emergency. We have introduced the principle of family medicine.
                </p>
                <Link to="/login" className="btn btn-main btn-round-full">
                  Make an appointment
                </Link>
              </div>

              {/* Feature 2: Working Hours */}
              <div className="feature-item mb-5 mb-lg-0">
                <div className="feature-icon mb-4 text-primary">
                  <FaClock size={40} />
                </div>
                <span>Timing schedule</span>
                <h4 className="mb-3">Working Hours</h4>
                <ul className="w-hours list-unstyled">
                  <li className="d-flex justify-content-between">
                    Sun - Wed : <span>8:00 - 17:00</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    Thu - Fri : <span>9:00 - 17:00</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    Sat - Sun : <span>10:00 - 17:00</span>
                  </li>
                </ul>
              </div>

              {/* Feature 3: Emergency Support */}
              <div className="feature-item mb-5 mb-lg-0">
                <div className="feature-icon mb-4 text-primary">
                  <MdSupportAgent size={40} />
                </div>
                <span>Emergency Cases</span>
                <h4 className="mb-3">1-800-700-6200</h4>
                <p>
                  Get All time support for emergency. We have introduced the principle of family medicine. Get Connected with us for any urgency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;