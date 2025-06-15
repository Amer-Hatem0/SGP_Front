// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import PatientSidebar from '../../components/PatientSidebar';
// import API_BASE_URL from '../../config/apiConfig';

// export default function ReportManager() {
//   const [reports, setReports] = useState([]);
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       const token = JSON.parse(localStorage.getItem('user')).token;
//       const decoded = JSON.parse(atob(token.split('.')[1]));
//       const userId = parseInt(decoded.userId || decoded.sub);

//       const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const patientId = res1.data.patientId;

//       const res2 = await axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setReports(res2.data);
//     } catch (error) {
//       console.error("Failed to fetch reports:", error);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     try {
//       const token = JSON.parse(localStorage.getItem('user')).token;
//       const decoded = JSON.parse(atob(token.split('.')[1]));
//       const userId = parseInt(decoded.userId || decoded.sub);

//       const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const patientId = res1.data.patientId;
//       const formData = new FormData();
//       formData.append('ReportFile', file);
//       formData.append('PatientId', patientId);

//       await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setFile(null);
//       setMessage('Uploaded successfully');
//       fetchReports();
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setMessage('Upload failed');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this report?")) return;
//     try {
//       const token = JSON.parse(localStorage.getItem('user')).token;
//       await axios.delete(`${API_BASE_URL}/ReportFile/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setReports(reports.filter(r => r.reportID !== id));
//       setMessage('Deleted successfully');
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setMessage('Failed to delete');
//     }
//   };

//   const handleDownload = async (id) => {
//     try {
//       const token = JSON.parse(localStorage.getItem('user')).token;
//       const response = await axios.get(`${API_BASE_URL}/ReportFile/Download/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob'
//       });

//       const blob = new Blob([response.data]);
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       const disposition = response.headers['content-disposition'];
//       const match = disposition?.match(/filename="?(.+)"?/);
//       link.download = match ? match[1] : 'report.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Download failed:", error);
//       setMessage("Download failed");
//     }
//   };

//   return (
//     <div className="patient-container-full">
//       <PatientSidebar />
//       <main className="p-6 flex flex-col gap-6 w-full">
//         <h2 className="text-2xl font-bold">Medical Reports</h2>

//         {/* Upload Section */}
//         <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow flex items-center gap-4">
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="border p-2 rounded w-full"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Upload
//           </button>
//         </form>

//         {message && <p className="text-green-600">{message}</p>}

//         {/* Reports Table */}
//         <div className="overflow-auto">
//           <table className="w-full table-auto border-collapse bg-white shadow-md rounded">
//             <thead className="bg-gray-100">
//               <tr className="text-left">
//                 <th className="p-3">File Name</th>
//                 <th className="p-3">Uploaded At</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reports.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="text-center p-4 text-gray-500">No reports available</td>
//                 </tr>
//               ) : (
//                 reports.map((r) => (
//                   <tr key={r.reportID} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{r.fileName}</td>
//                     <td className="p-3">{r.uploadedAt?.split('T')[0]}</td>
//                     <td className="p-3 space-x-2">
//                       <button onClick={() => handleDownload(r.reportID)} className="text-blue-600 hover:underline">Download</button>
//                       <button onClick={() => handleDelete(r.reportID)} className="text-red-600 hover:underline">Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>


//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';
import PatientNavbar from '../../components/PatientNavbar';
export default function ReportManager() {
  const [reports, setReports] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

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
      formData.append('Description', description);

      await axios.post(`${API_BASE_URL}/ReportFile/Upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFile(null);
      setDescription('');
      setPreviewUrl(null);
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
    (r.description?.toLowerCase().includes(search.toLowerCase()))
  );
  const handlePreview = (report) => {
    setSelectedReport(report);
  };

  return (
    <> 
      <PatientNavbar />
    <div className="patient-container-full">
     
      <main className="p-6 flex mt-5 flex-col gap-6 w-full">
        <h2 className="text-2xl   pb-5 font-bold">Medical Reports</h2>

        <form onSubmit={handleUpload} className="report-upload-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {previewUrl && <img src={previewUrl} alt="Preview" className="rrrrrrrrrr rounded" />}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Upload Report
          </button>
        </form>

        {message && <p className="text-green-600 font-semibold">{message}</p>}

        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
       className="report-search"
        />

     <div className="report-grid">
  {filteredReports.map((r) => (
    <div className="report-card" key={r.reportID}>
      <h3 onClick={() => handlePreview(r)} className="report-card-title">{r.fileName}</h3>
      <p className="report-card-description">{r.description || 'No description'}</p>
      <p className="report-card-date">Uploaded: {r.uploadedAt?.split('T')[0]}</p>
      <div className="report-card-actions">
        <button onClick={() => handleDownload(r.reportID)} className="download-btn">Download</button>
        <button onClick={() => handleDelete(r.reportID)} className="delete-btn">Delete</button>
      </div>
    </div>
  ))}
</div>


        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setSelectedReport(null)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">{selectedReport.fileName}</h2>
              {selectedReport.fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={`http://localhost:5014${selectedReport.fileUrl}`}
                  alt="report"
                  className="max-h-[500px] mx-auto"
                />
              ) : (
                <iframe
                  src={`http://localhost:5014${selectedReport.fileUrl}`}
                  className="w-full h-[500px]"
                  title="report"
                ></iframe>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
    </>
  );
}
