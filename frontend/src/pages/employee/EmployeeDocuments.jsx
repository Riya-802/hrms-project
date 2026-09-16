import React from 'react';
import { FileText, Download, ShieldCheck, Upload } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

const EmployeeDocuments = () => {
  const { addToast } = useHRMS();

  const documents = [
    { title: 'Employee Employment Contract 2026', type: 'PDF', size: '2.4 MB', category: 'Official' },
    { title: 'Company Code of Conduct & Ethics', type: 'PDF', size: '1.8 MB', category: 'Policy' },
    { title: 'Health & Medical Benefits Policy Guide', type: 'PDF', size: '3.1 MB', category: 'Benefits' },
    { title: 'IT Equipment & Cyber Security Policy', type: 'PDF', size: '1.2 MB', category: 'Policy' }
  ];

  const handleDownload = (docName) => {
    addToast(`Downloading ${docName}...`, 'info');
  };

  const handleUpload = () => {
    addToast('File upload feature ready. Select document to upload.', 'success');
  };

  return (
    <div className="employee-page-container">
      <div className="emp-card">
        <div className="emp-card-header">
          <h3>Company & Policy Documents</h3>
          <button className="btn btn-outline" onClick={handleUpload}>
            <Upload size={16} style={{ marginRight: '0.4rem' }} /> Upload Document
          </button>
        </div>
        <div className="emp-card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Category</th>
                  <th>Type / Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} color="#2563eb" />
                        <span>{doc.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{doc.category}</span></td>
                    <td>{doc.type} • {doc.size}</td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }} onClick={() => handleDownload(doc.title)}>
                        <Download size={14} style={{ marginRight: '0.3rem' }} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocuments;
