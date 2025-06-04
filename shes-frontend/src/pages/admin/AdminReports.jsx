// AdminReports.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetAllReportFiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <h2 className="mb-4 text-primary">Uploaded Medical Reports</h2>

        {loading ? (
          <div className="text-center">Loading reports...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Report Name</th>
                  <th>Uploaded At</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>{report.patientName}</td>
                    <td>{report.fileName}</td>
                    <td>{new Date(report.uploadedAt).toLocaleDateString()}</td>
                    <td>
<a
  href={`${API_BASE_URL}/Files${report.fileUrl}`}  
  className="btn btn-sm btn-primary"
  download
>
  Download
</a>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReports;
