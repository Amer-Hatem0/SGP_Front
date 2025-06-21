import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import service1 from '../../assets/images/service/service-1.jpg';
import service2 from '../../assets/images/service/service-2.jpg';
import service3 from '../../assets/images/service/service-3.jpg';
import service4 from '../../assets/images/service/service-4.jpg';
import service5 from '../../assets/images/service/service-8.jpg';
import service6 from '../../assets/images/service/service-6.jpg';
 
import { Link } from 'react-router-dom';

const ServicesPage = () => {
    return (
        <div id="top">
            {/* Page Title */}
            <Header />
            <section className="page-title bg-1">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="block text-center">
                                <span className="text-white">Our services</span>
                                <h1 className="text-capitalize mb-5 text-lg">What We Do</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section service-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5">
                                <img src={service1} alt="Child Care" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">Child care</h4>
                                    <p className="mb-4">We offer compassionate and comprehensive pediatric care, ensuring your child’s health and development are in safe hands.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5">
                                <img src={service2} alt="Personal Care" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">Personal Care</h4>
                                    <p className="mb-4">Our medical team delivers tailored care for each patient, focusing on comfort, dignity, and long-term well-being.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5">
                                <img src={service3} alt="CT Scan" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">CT scan</h4>
                                    <p className="mb-4">Utilizing state-of-the-art imaging technology to ensure accurate and quick diagnostic results for a wide range of conditions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5 mb-lg-0">
                                <img src={service4} alt="Joint Replacement" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">Joint replacement</h4>
                                    <p className="mb-4">Our surgeons specialize in advanced joint replacement procedures to restore mobility and relieve chronic pain.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5 mb-lg-0">
                                <img src={service6} alt="Examination & Diagnosis" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">Examination & Diagnosis</h4>
                                    <p className="mb-4">We provide accurate laboratory diagnostics and expert evaluation to ensure precise and early detection of medical conditions.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="service-block mb-5 mb-lg-0">
                                <img src={service5} alt="Alzheimer's disease" className="img-fluid" />
                                <div className="content">
                                    <h4 className="mt-4 mb-2 title-color">Alzheimer's disease</h4>
                                    <p className="mb-4">Comprehensive support and management plans for patients with Alzheimer’s, focusing on improving quality of life and slowing disease progression.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
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

export default ServicesPage;