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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-bold text-slate-900">Company & Policy Documents</h3>
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm" 
            onClick={handleUpload}
          >
            <Upload size={16} /> Upload Document
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document Title</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type / Size</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <FileText size={18} className="text-blue-600 shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{doc.type} • {doc.size}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        onClick={() => handleDownload(doc.title)}
                      >
                        <Download size={14} /> Download
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
