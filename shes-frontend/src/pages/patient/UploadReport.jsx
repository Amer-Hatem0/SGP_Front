 
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import PatientNavbar from '../../components/PatientNavbar';
import { Modal } from 'bootstrap';

 

export default function ReportManager() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const reportDetailsModalRef = useRef();
  const uploadModalRef = useRef();

  useEffect(() => {
    fetchReports();
    fetchSpecializationsFromDoctors();
  }, []);

const fetchReports = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = parseInt(decoded.userId || decoded.sub);

    const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const patientId = res1.data.patientId;

    const res2 = await axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // استخراج الامتداد من اسم الملف
    const reportsWithExtension = res2.data.map(r => ({
      ...r,
      fileExtension: r.fileName?.split('.').pop().toLowerCase() || ''
    }));

    setReports(reportsWithExtension);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    setMessage("Failed to load reports.");
  }
};

  const fetchSpecializationsFromDoctors = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const res = await axios.get(`${API_BASE_URL}/Patient/Doctors`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      const doctorList = res.data;
      const uniqueSpecs = [...new Set(doctorList.map(d => d.specialization).filter(Boolean))];
      setSpecializations(uniqueSpecs);
    } catch (error) {
      console.error("Failed to extract specializations from doctors:", error);
      setMessage("Failed to load specializations.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedSpecialization) {
      setMessage('Please select a file and a specialization.');
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = parseInt(decoded.userId || decoded.sub);

      const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const patientId = res1.data.patientId;
      const formData = new FormData();
      formData.append('ReportFile', file);
      formData.append('PatientId', patientId);
      formData.append('Description', description);
      formData.append('Specialization', selectedSpecialization);

      await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFile(null);
      setDescription('');
      setSelectedSpecialization('');
      setPreviewUrl(null);
      setMessage('✅ Report uploaded successfully!');
      fetchReports();
      const uploadModalInstance = Modal.getInstance(uploadModalRef.current);
      if (uploadModalInstance) {
        uploadModalInstance.hide();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage('❌ Upload failed. Please try again.');
    } finally {
        setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.delete(`${API_BASE_URL}/ReportFile/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reports.filter(r => r.reportID !== id));
      setMessage('✅ Report deleted successfully!');
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage('❌ Failed to delete report.');
    } finally {
        setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.get(`${API_BASE_URL}/ReportFile/Download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName || 'report';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage('✅ Report download started.');
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("❌ Download failed. Please try again.");
    } finally {
        setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith('image')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const filteredReports = reports.filter(r =>
    r.fileName.toLowerCase().includes(search.toLowerCase()) ||
    (r.description?.toLowerCase().includes(search.toLowerCase())) ||
    (r.specialization?.toLowerCase().includes(search.toLowerCase()))
  );

const openReportDetailsModal = async (report) => {
  try {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const response = await axios.get(`${API_BASE_URL}/ReportFile/Download/${report.reportID}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });

    const fileExtension = report.fileName?.split('.').pop().toLowerCase() || '';
    const blobUrl = URL.createObjectURL(response.data);

    setSelectedReport({
      ...report,
      fileExtension,
      previewUrl: blobUrl  // 👈 استخدم هذا للعرض لاحقًا
    });

    setTimeout(() => {
      const modal = new Modal(reportDetailsModalRef.current);
      modal.show();
    }, 100);
  } catch (error) {
    console.error("Error loading preview:", error);
    setMessage("❌ Failed to load report preview.");
  }
};


  const openUploadModal = () => {
    setFile(null);
    setDescription('');
    setSelectedSpecialization('');
    setPreviewUrl(null);
    setMessage('');
    setTimeout(() => {
        const modal = new Modal(uploadModalRef.current);
        modal.show();
    }, 100);
  };

const getReportPreviewContent = () => {
  if (!selectedReport || !selectedReport.previewUrl) return null;

  const { previewUrl, fileExtension } = selectedReport;

  if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
    return (
      <img
        src={previewUrl}
        alt="Report Preview"
        className="img-fluid rounded shadow-sm mb-3"
        style={{ maxHeight: '60vh', width: '100%', objectFit: 'contain' }}
      />
    );
  } else if (fileExtension === 'pdf') {
    return (
      <iframe
        src={previewUrl}
        width="100%"
        style={{ height: '60vh', border: 'none' }}
        title="PDF Report Preview"
      >
        This browser does not support PDFs. Please <a href={previewUrl} target="_blank" rel="noopener noreferrer">download the PDF</a> to view it.
      </iframe>
    );
  } else {
    return (
      <div className="alert alert-info text-center" role="alert">
        <i className="bi bi-info-circle me-2"></i> No preview available for this file type.<br /> Please download the file to view it.
      </div>
    );
  }
};


  return (
    <>
      <PatientNavbar />
      <div className="container-fluid py-4 report-manager-container">
        <main className="container-md mt-5">
          <h2 className="mb-4 text-primary fw-bold text-center">Medical Reports</h2>

          <div className="d-flex justify-content-end mb-4">
              <button className="btn btn-success d-flex align-items-center" onClick={openUploadModal}>
                  <i className="bi bi-upload me-2"></i> Upload New Report
              </button>
          </div>

          {message && (
            <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                {message.substring(2)}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMessage('')}></button>
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search reports by file name, description, or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control form-control-lg shadow-sm report-search-input"
            />
          </div>

          {filteredReports.length === 0 ? (
            <div className="text-center p-5 border rounded shadow-sm bg-light">
              <p className="lead text-muted">No reports found.</p>
              <button className="btn btn-info mt-3" onClick={openUploadModal}>Upload your first report!</button>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 report-grid">
              {filteredReports.map((r) => (
                <div className="col" key={r.reportID}>
                  <div className="card h-100 shadow-sm report-card">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary fw-bold report-card-title" onClick={() => openReportDetailsModal(r)}>
                        {r.fileName}
                      </h5>
                      <p className="card-text text-muted flex-grow-1 report-card-description">
                        {r.description || 'No description available.'}
                      </p>
                      <p className="card-text">
                        <span> Specialization: </span>
                        <small className="text-specialization fw-medium">
                          {r.specialization || 'Not specified'}
                        </small>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Uploaded: {r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : 'N/A'}
                        </small>
                      </p>
                      <div className="d-flex justify-content-between mt-3 report-card-actions">
                        <button onClick={() => handleDownload(r.reportID, r.fileName)} className="btn btn-outline-primary btn-sm me-2 download-btn">
                          <i className="bi bi-download me-1"></i> Download
                        </button>
                        <button onClick={() => handleDelete(r.reportID)} className="btn btn-outline-danger btn-sm delete-btn">
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedReport && (
        <div className="modal fade" id="reportDetailsModal" tabIndex="-1" aria-labelledby="reportDetailsModalLabel" aria-hidden="true" ref={reportDetailsModalRef}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title" id="reportDetailsModalLabel">{selectedReport.fileName}</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedReport(null)}></button>
              </div>
              <div className="modal-body">
                {getReportPreviewContent()}
                <hr className="my-4"/>
                <p><strong>Description:</strong> {selectedReport.description || 'No description provided.'}</p>
                <p><strong>Specialization:</strong> {selectedReport.specialization || 'Not specified'}</p>
                <p><strong>Uploaded At:</strong> {selectedReport.uploadedAt ? new Date(selectedReport.uploadedAt).toLocaleString() : 'N/A'}</p>
                <p><strong>File Type:</strong> {selectedReport.fileExtension ? `.${selectedReport.fileExtension}` : 'N/A'}</p>
                <p><strong>File Size:</strong> {selectedReport.fileSize ? `${(selectedReport.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" onClick={() => setSelectedReport(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => handleDownload(selectedReport.reportID, selectedReport.fileName)}>
                  <i className="bi bi-download me-1"></i> Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="modal fade" id="uploadReportModal" tabIndex="-1" aria-labelledby="uploadReportModalLabel" aria-hidden="true" ref={uploadModalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="uploadReportModalLabel">Upload New Medical Report</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="reportFile" className="form-label">Select Report File</label>
                  <input type="file" id="reportFile" onChange={handleFileChange} className="form-control" required />
                  {previewUrl && (
                    <div className="mt-3 text-center">
                      <img src={previewUrl} alt="File Preview" className="img-fluid rounded" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                      <p className="text-muted mt-2">Image Preview</p>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description (Optional)</label>
                  <textarea
                    id="description"
                    placeholder="e.g., Blood test results, X-ray report..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="specialization" className="form-label">Specialization</label>
                  <select
                    id="specialization"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">-- Select Relevant Specialization --</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-upload me-1"></i> Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}