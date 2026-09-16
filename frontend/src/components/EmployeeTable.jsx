import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const EmployeeTable = ({ employees = [] }) => {
  const navigate = useNavigate();
  const { openModal, deleteEmployee } = useHRMS();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = (employee) => {
    openModal({
      title: 'Delete Employee',
      message: `Are you sure you want to delete "${employee.fullName}" (${employee.id})? This action cannot be undone.`,
      confirmText: 'Delete Employee',
      type: 'danger',
      onConfirm: () => {
        deleteEmployee(employee.id);
      }
    });
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Salary</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{emp.id}</td>
                  <td>
                    <div className="table-user-cell">
                      <img 
                        src={emp.profilePhoto} 
                        alt={emp.fullName} 
                        className="table-user-avatar"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                      <div>
                        <div className="table-user-name">{emp.fullName}</div>
                        <div className="table-user-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>{emp.phone}</td>
                  <td>{emp.designation}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{emp.department}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{emp.joiningDate}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#047857' }}>
                      {emp.salary}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={emp.status} />
                  </td>
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="btn-icon view" 
                        title="View Details"
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon edit" 
                        title="Edit Employee"
                        onClick={() => navigate(`/admin/employees/${emp.id}/edit`)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        title="Delete Employee"
                        onClick={() => handleDeleteClick(emp)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {employees.length > 0 && (
        <div className="pagination-wrapper">
          <div>
            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, employees.length)}</strong> of <strong>{employees.length}</strong> employees
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button 
              className="page-btn" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
