import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import API_BASE_URL from '../../config/apiConfig';
import Navbar from '../../components/DrNavbar';
import Spinner from '../../components/Spinner';
import { Modal } from 'bootstrap';

export default function PatientDetails() {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAccordionIdx, setOpenAccordionIdx] = useState(null); // New state to manage open accordion

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const reportViewerModalRef = useRef();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientFullHistory/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      alert('Patient not found or error fetching data.');
    } finally {
      setLoading(false); // Ensure loading is set to false here as well
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientReports/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePatientChange = (e) => {
    setPatientId(e.target.value);
    setHistory(null);
    setReports([]);
    setOpenAccordionIdx(null); // Reset open accordion when patient changes
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyPatients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };
    fetchPatients();
  }, [token]);

  const showReport = (reportData) => {
    const fileExtension = reportData.fileExtension ? reportData.fileExtension.toLowerCase() : '';
    const fileUrl = `${API_BASE_URL}/ReportFile/Download/${reportData.reportID}`;

    setSelectedReport({
      url: fileUrl,
      fileName: reportData.fileName,
      fileExtension: fileExtension,
      reportID: reportData.reportID
    });
    setTimeout(() => {
        const modal = new Modal(reportViewerModalRef.current);
        modal.show();
    }, 100);
  };

  const closeModal = () => {
    setSelectedReport(null);
    const modalInstance = Modal.getInstance(reportViewerModalRef.current);
    if (modalInstance) {
        modalInstance.hide();
    }
  };

  const handleAccordionToggle = (idx) => {
    setOpenAccordionIdx(openAccordionIdx === idx ? null : idx);
  };

  const filteredReports = reports.filter(r =>
    r.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.specialization?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getReportPreviewContent = () => {
    if (!selectedReport) return null;

    const { url, fileExtension } = selectedReport;

    if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      return (
        <img
          src={url}
          alt="Report Preview"
          className="report-preview-image"
        />
      );
    } else if (fileExtension === 'pdf') {
      return (
        <iframe
          src={url}
          className="report-preview-iframe"
          title="PDF Report Preview"
        >
          This browser does not support PDFs. Please <a href={url} target="_blank" rel="noopener noreferrer">download the PDF</a> to view it.
        </iframe>
      );
    } else {
      return (
        <div className="no-preview-message">
          <i className="bi bi-info-circle"></i> No preview available for this file type.<br/> Please download the file to view it.
        </div>
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="PatientDetails-container">
        <DoctorSidebar />
        <main className="PatientDetails-main">
          <h1 className="PatientDetails-title">Patient Full Details</h1>

          <div className="PatientDetails-form-card">
            <h4 className="card-heading">Select Patient to View Details</h4>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="patientSelect" className="PatientDetails-label visually-hidden">Select Patient</label>
                <select
                  id="patientSelect"
                  className="PatientDetails-input PatientDetails-select"
                  value={patientId}
                  onChange={handlePatientChange}
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.fullName} ({p.gender})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-col button-col">
                <button
                  className="PatientDetails-button"
                  onClick={() => {
                    fetchHistory();
                    fetchReports();
                  }}
                  disabled={!patientId || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-eye-fill"></i> Show Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="loading-spinner-container">
              <Spinner message="Fetching patient data..." />
            </div>
          )}

          {!loading && history && (
            <div className="PatientDetails-content-grid">
              {/* Patient Basic Info Card */}
              <div className="PatientDetails-infoCard">
                <div className="card-content-wrapper">
                  <h5 className="info-card-title">
                    <i className="bi bi-person-circle"></i>Patient Information
                  </h5>
                  <p><strong>Full Name:</strong> {history.fullName}</p>
                  <p><strong>Age:</strong> {history.age}</p>
                  <p><strong>Gender:</strong> {history.gender}</p>
                </div>
              </div>

              {/* Appointments Section */}
              <div className="PatientDetails-section PatientDetails-appointments">
                <div className="card-content-wrapper">
                  <h5 className="section-subtitle">
                    <i className="bi bi-calendar-check"></i>Appointments History
                  </h5>
                  {history.visits && history.visits.length > 0 ? (
                    <div className="table-responsive-custom">
                      <table className="appointments-table">
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Doctor</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.visits.map((visit, idx) => (
                            <tr key={idx}>
                              <td>{new Date(visit.appointmentDate).toLocaleString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric',
                                  hour: '2-digit', minute: '2-digit', hour12: true
                              })}</td>
                              <td>{visit.doctorName}</td>
                              <td>
                                <span className={`status-badge status-${
                                  visit.status === 'Completed' ? 'completed' :
                                  visit.status === 'Pending' ? 'pending' :
                                  'other'
                                }`}>{visit.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-data-message">No appointment history available.</p>
                  )}
                </div>
              </div>

              {/* Medical History Section */}
              <div className="PatientDetails-section PatientDetails-medical-history">
                <div className="card-content-wrapper">
                  <h5 className="section-subtitle">
                    <i className="bi bi-file-medical"></i>Medical Records
                  </h5>
                  {history.medicalHistories && history.medicalHistories.length > 0 ? (
                    <div className="custom-accordion">
                      {history.medicalHistories.map((record, idx) => (
                        <div className="accordion-item-custom" key={idx}>
                          <h2 className="accordion-header-custom" id={`heading${idx}`}>
                          
                              <strong>Diagnosis: {record.disease}</strong>
                              
                           </h2>     <span className=" ms-4 mt-3 record-date">{new Date(record.recordedAt).toLocaleDateString()}</span>
                           
                         
                          <div
                            id={`collapse${idx}`}
                            className={`accordion-collapse-custom   ${openAccordionIdx === idx ? 'show' : ''}`}
                            aria-labelledby={`heading${idx}`}
                            data-bs-parent="#medicalHistoryAccordion" // Ensure this ID matches the parent div if multiple collapse items
                          >
                            <div className="accordion-body-custom">
                           <p><strong className="ppppp" >Treatment:</strong> {record?.treatment?.trim() ? record.treatment : 'N/A'}</p>
<p className="mb-0"><strong className="ppppp">Notes:</strong> {record?.notes?.trim() ? record.notes : 'N/A'}</p>

                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data-message">No medical history records available.</p>
                  )}
                </div>
              </div>

           
            {/* Uploaded Reports Section */}
<div className="PatientDetails-section PatientDetails-reports">
  <div className="card-content-wrapper">
    <h5 className="section-subtitle">
      <i className="bi bi-file-earmark-medical"></i>Uploaded Reports
    </h5>

    {reports.length === 0 ? (
      <p className="no-data-message">No reports found for this patient.</p>
    ) : (
      <>
        <div className="report-search-container">
          <input
            type="text"
            className="report-search-input-custom"
            placeholder="Search reports by file name, description, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ul className="reports-list-group">
          {filteredReports.map((rpt, idx) => (
            <li key={idx} className="report-list-item">
              <button
                onClick={() => {
                  const fileUrl = `${API_BASE_URL.replace('/api', '')}${rpt.fileUrl.startsWith('/') ? '' : '/'}${rpt.fileUrl}`;
                  const fileExtension = rpt.fileName?.split('.').pop().toLowerCase();
                  setSelectedReport({
                    url: fileUrl,
                    fileName: rpt.fileName,
                    fileExtension,
                  });
                }}
                className="report-view-button"
              >
                <i className="bi bi-paperclip"></i>
                <span>{rpt.fileName}</span>
                <small className="report-specialization-text">
                  Specialization: {rpt.specialization || 'N/A'}
                </small>
              </button>

              <a
                href={`${API_BASE_URL.replace('/api', '')}${rpt.fileUrl}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="report-download-button"
              >
                <i className="bi bi-download"></i> Download
              </a>
            </li>
          ))}
        </ul>

        {/* Preview of selected report */}
        {selectedReport && (
          <div className="mt-4">
            <h5 className="text-primary mb-3">
              📄 Viewing Report: {selectedReport.fileName}
            </h5>

            {['png', 'jpg', 'jpeg', 'gif'].includes(selectedReport.fileExtension) ? (
              <img
                src={selectedReport.url}
                alt="Report Preview"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
            ) : selectedReport.fileExtension === 'pdf' ? (
              <iframe
                src={selectedReport.url}
                title="PDF Viewer"
                style={{
                  width: '100%',
                  height: '600px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <div className="alert alert-warning mt-3">
                No preview available.{" "}
                <a href={selectedReport.url} download target="_blank" rel="noopener noreferrer">
                  Click here to download
                </a>
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>
</div>

            </div>
          )}

          {!loading && !history && patientId && (
            <div className="no-data-alert">
              <Spinner message="Loading doctor dashboard..." />
            </div>
          )}

        </main>
      </div>

    {selectedReport && (
  <div className="custom-report-overlay" onClick={() => setSelectedReport(null)}>
    <div className="custom-report-modal" onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-primary mb-0">{selectedReport.fileName}</h5>
        <button className="btn btn-danger btn-sm" onClick={() => setSelectedReport(null)}>
          <i className="bi bi-x-circle"></i> Close
        </button>
      </div>

      {['png', 'jpg', 'jpeg', 'gif'].includes(selectedReport.fileExtension) ? (
        <img
          src={selectedReport.url}
          alt="Report Preview"
          className="w-100"
          style={{ maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
        />
      ) : selectedReport.fileExtension === 'pdf' ? (
        <iframe
          src={selectedReport.url}
          title="PDF Viewer"
          style={{ width: '100%', height: '70vh', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      ) : (
        <div className="alert alert-warning mt-3">
          No preview available.{" "}
          <a href={selectedReport.url} download target="_blank" rel="noopener noreferrer">
            Click here to download
          </a>
        </div>
      )}
    </div>

    <style>{`
      .custom-report-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .custom-report-modal {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 1000px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: fadeIn 0.3s ease-in-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
)}


      {/* Embedded CSS Styles */}
      <style>{`
        /* General Layout and Background */
        .PatientDetails-container {
            display: flex;
            min-height: calc(100vh - 60px); /* Adjust for Navbar */
            background-color: #f0f2f5; /* Light grey background */
        }

        .PatientDetails-main {
            flex-grow: 1;
            padding: 40px;
            background-color: #f0f2f5;
        }

        /* Page Title */
        .PatientDetails-title {
            font-size: 2.5rem;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 50px;
            position: relative;
            padding-bottom: 15px;
            font-weight: 700;
        }

        .PatientDetails-title::after {
            content: '';
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            width: 100px;
            height: 5px;
            background-color: #007bff; /* Primary blue underline */
            border-radius: 3px;
        }

        /* Select Patient Form Card */
        .PatientDetails-form-card {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
            border: 1px solid #e0e0e0;
        }

        .card-heading {
            font-size: 1.6rem;
            color: #34495e;
            margin-bottom: 25px;
            font-weight: 600;
            text-align: center;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap; /* Allows wrapping on smaller screens */
            gap: 20px;
            align-items: flex-end;
        }

        .form-col {
            flex: 1;
            min-width: 250px; /* Minimum width for columns */
        }

        .form-col.button-col {
            flex: 0 0 auto; /* Prevent button column from growing */
        }

        .PatientDetails-label {
            font-size: 1rem;
            color: #555;
            margin-bottom: 8px;
            display: block;
        }

        .PatientDetails-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 1.1rem;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .PatientDetails-input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
        }

        .PatientDetails-select {
            appearance: none; /* Remove default arrow */
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 15px center;
            background-size: 1.2rem;
            padding-right: 35px; /* Space for custom arrow */
        }

        .PatientDetails-button {
            background-color: #007bff; /* Primary blue */
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .PatientDetails-button:hover:not(:disabled) {
            background-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
        }

        .PatientDetails-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            opacity: 0.7;
        }

        /* Loading Spinner */
        .loading-spinner-container {
            text-align: center;
            padding: 60px 0;
        }

        /* Patient Details Content Grid */
        .PatientDetails-content-grid {
            display: grid;
            grid-template-columns: 1fr; /* Default to single column */
            gap: 30px;
        }

        @media (min-width: 992px) { /* Large screens */
            .PatientDetails-content-grid {
                grid-template-columns: 1fr 2fr; /* Info card on left, appointments on right */
                grid-template-areas:
                    "info appointments"
                    "history history"
                    "reports reports";
            }
            .PatientDetails-infoCard { grid-area: info; }
            .PatientDetails-appointments { grid-area: appointments; }
            .PatientDetails-medical-history { grid-area: history; }
            .PatientDetails-reports { grid-area: reports; }
        }

        @media (min-width: 768px) and (max-width: 991px) { /* Medium screens */
            .PatientDetails-content-grid {
                grid-template-columns: 1fr 1fr; /* Two columns for cards */
            }
        }


        /* Individual Sections/Cards */
        .PatientDetails-infoCard,
        .PatientDetails-section {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
            border: 1px solid #e9ecef;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .PatientDetails-infoCard:hover,
        .PatientDetails-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .card-content-wrapper {
            padding: 30px;
        }

        .info-card-title,
        .section-subtitle {
            font-size: 1.5rem;
            color: #007bff; /* Primary blue */
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .info-card-title i,
        .section-subtitle i {
            font-size: 1.8rem;
            color: #4CAF50; /* A pleasant green for icons */
        }

        .PatientDetails-infoCard p {
            font-size: 1.05rem;
            color: #34495e;
            line-height: 1.8;
        }
        .PatientDetails-infoCard p strong {
            color: #2c3e50;
        }


        /* Appointments Table */
        .table-responsive-custom {
            overflow-x: auto; /* For responsive tables */
        }

        .appointments-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 0.95rem;
        }

        .appointments-table th,
        .appointments-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }

        .appointments-table th {
            background-color: #f8f9fa;
            color: #495057;
            font-weight: 600;
            text-transform: uppercase;
        }

        .appointments-table tbody tr:nth-child(even) {
            background-color: #fefefe;
        }

        .appointments-table tbody tr:hover {
            background-color: #e9f7fe; /* Light blue hover */
        }

        .status-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
        }

        .status-completed {
            background-color: #d4edda;
            color: #155724;
        }

        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }

        .status-other {
            background-color: #e2e3e5;
            color: #6c757d;
        }

        /* Custom Accordion for Medical History */
        .custom-accordion {
            margin-top: 20px;
        }

        .accordion-item-custom {
            border: 1px solid #e0e0e0;
            margin-bottom: 10px;
            border-radius: 8px;
            overflow: hidden;
        }

        .accordion-header-custom {
            margin-bottom: 0;
        }

        .accordion-button-custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 15px 20px;
            background-color: #f8f9fa;
            border: none;
            font-size: 1.05rem;
            font-weight: 500;
            color: #34495e;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.3s ease, color 0.3s ease;
            border-radius: 8px; /* Apply to collapsed state */
        }

        .accordion-button-custom:hover:not(.collapsed) {
            background-color: #e9ecef;
        }

        .accordion-button-custom.collapsed {
            background-color: #ffffff;
            color: #2c3e50;
            border-bottom: none;
        }

        .accordion-button-custom:not(.collapsed) {
            background-color: #e9f7fe; /* Light blue when open */
            color: #007bff;
            box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .accordion-button-custom:focus {
            outline: none;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .accordion-button-custom .record-date {
            font-size: 0.85rem;
            color: #6c757d;
        }

        /* Arrow indicator for accordion */
        .accordion-button-custom::after {
            flex-shrink: 0;
            width: 1.25rem;
            height: 1.25rem;
            margin-left: auto;
            content: "";
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-size: 1.25rem;
            transition: transform .2s ease-in-out;
        }

        .accordion-button-custom:not(.collapsed)::after {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23007bff'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
            transform: rotate(-180deg);
        }


        .accordion-collapse-custom {
            border-top: 1px solid #e0e0e0;
        }

        .accordion-body-custom {
            padding: 20px;
            background-color: #fdfdfd;
            font-size: 0.95rem;
            color: #495057;
        }

        .accordion-body-custom p {
            margin-bottom: 10px;
        }

        /* Reports Section */
        .report-search-container {
            margin-bottom: 20px;
        }

        .report-search-input-custom {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ced4da;
            border-radius: 8px;
            font-size: 1rem;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .report-search-input-custom:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
        }

        .reports-list-group {
            list-style: none;
            padding: 0;
            margin: 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden; /* Ensures border-radius is applied to children */
        }

        .report-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            background-color: #ffffff;
            transition: background-color 0.2s ease;
        }

        .report-list-item:last-child {
            border-bottom: none;
        }

        .report-list-item:hover {
            background-color: #f6faff; /* Lighter blue on hover */
        }

        .report-view-button {
            background: none;
            border: none;
            text-align: left;
            padding: 0;
            color: #007bff;
            cursor: pointer;
            font-size: 1rem;
            flex-grow: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: color 0.2s ease;
        }

        .report-view-button:hover {
            color: #0056b3;
            text-decoration: underline;
        }

        .report-view-button i {
            font-size: 1.2rem;
            color: #6c757d;
        }

        .report-view-button span {
            font-weight: 500;
        }
.ppppp{
   color:rgb(0, 0, 0);
        font-weight: 500;
   }
        .report-specialization-text {
            font-size: 0.85rem;
            color: #888;
            margin-left: auto; /* Pushes specialization to the right */
        }

        .report-download-button {
            background-color: #e6f2ff;
            color: #007bff;
            border: 1px solid #007bff;
            padding: 8px 15px;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            transition: background-color 0.3s ease, color 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
            text-decoration: none;
        }

        .report-download-button:hover {
            background-color: #007bff;
            color: white;
        }

        /* No data message */
        .no-data-message {
            padding: 30px;
            text-align: center;
            color: #6c757d;
            font-style: italic;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px dashed #e9ecef;
        }

        .no-data-alert {
            padding: 20px;
            text-align: center;
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
            border-radius: 8px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .no-data-alert i {
            font-size: 1.5rem;
        }

        /* Report Viewer Modal overrides */
        /* These ensure the Bootstrap modal elements look good with your custom theme */
        .modal-content {
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
            border: none !important;
        }

        .modal-header {
            border-top-left-radius: 10px !important;
            border-top-right-radius: 10px !important;
            padding: 20px !important;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .modal-title {
            font-weight: 600 !important;
            font-size: 1.6rem !important;
        }

        .modal-body-no-padding {
            padding: 0 !important; /* Ensure no padding for iframe/image */
        }

        .modal-footer {
            border-bottom-left-radius: 10px !important;
            border-bottom-right-radius: 10px !important;
            padding: 15px 25px !important;
            border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
        }

        .report-preview-image, .report-preview-iframe {
            width: 100%;
            height: 60vh; /* Fixed height for consistent modal size */
            object-fit: contain; /* For images */
            border: none; /* For iframe */
            background-color: #f8f9fa; /* Light background for viewer */
        }

        .no-preview-message {
            padding: 40px;
            text-align: center;
            background-color: #f0f8ff;
            color: #007bff;
            border-radius: 8px;
            font-weight: 500;
            font-size: 1.1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .no-preview-message i {
            font-size: 3rem;
            color: #007bff;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .PatientDetails-main {
                padding: 20px;
            }
            .PatientDetails-title {
                font-size: 2rem;
                margin-bottom: 40px;
            }
      `}</style>
    </div>
  );
}