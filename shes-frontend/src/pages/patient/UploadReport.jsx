import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';

export default function ReportManager() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
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

      setReports(res2.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

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

      await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFile(null);
      setMessage('Uploaded successfully');
      fetchReports();
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.delete(`${API_BASE_URL}/ReportFile/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reports.filter(r => r.reportID !== id));
      setMessage('Deleted successfully');
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage('Failed to delete');
    }
  };

  const handleDownload = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.get(`${API_BASE_URL}/ReportFile/Download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="?(.+)"?/);
      link.download = match ? match[1] : 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("Download failed");
    }
  };

  return (
    <div className="patient-container-full">
      <PatientSidebar />
      <main className="p-6 flex flex-col gap-6 w-full">
        <h2 className="text-2xl font-bold">Medical Reports</h2>

        {/* Upload Section */}
        <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow flex items-center gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>

        {message && <p className="text-green-600">{message}</p>}

        {/* Reports Table */}
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">File Name</th>
                <th className="p-3">Uploaded At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">No reports available</td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.reportID} className="border-t hover:bg-gray-50">
                    <td className="p-3">{r.fileName}</td>
                    <td className="p-3">{r.uploadedAt?.split('T')[0]}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => handleDownload(r.reportID)} className="text-blue-600 hover:underline">Download</button>
                      <button onClick={() => handleDelete(r.reportID)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
  
  
    </div>
  );
}
