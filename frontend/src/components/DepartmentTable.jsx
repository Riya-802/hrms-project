import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const DepartmentTable = ({ departments = [] }) => {
  const navigate = useNavigate();
  const { openModal, deleteDepartment, employees } = useHRMS();

  const handleDeleteClick = (dept) => {
    const assignedCount = employees.filter((e) => e.department === dept.name).length;
    openModal({
      title: 'Delete Department',
      message: `Are you sure you want to delete department "${dept.name}" (${dept.id})? ${
        assignedCount > 0 ? `Note: ${assignedCount} employee(s) currently belong to this department.` : ''
      }`,
      confirmText: 'Delete Department',
      type: 'danger',
      onConfirm: () => {
        deleteDepartment(dept.id);
      }
    });
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Dept ID</th>
              <th>Department Name</th>
              <th>Description</th>
              <th>No. of Employees</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => {
                const count = employees.filter((e) => e.department === dept.name).length;
                return (
                  <tr key={dept.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{dept.id}</td>
                    <td style={{ fontWeight: '600' }}>{dept.name}</td>
                    <td style={{ maxWidth: '320px', color: 'var(--text-muted)' }}>{dept.description}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                        <Users size={16} color="var(--accent)" />
                        <span>{count}</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={dept.status} />
                    </td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon view" 
                          title="View Department Details"
                          onClick={() => navigate(`/admin/departments/${dept.id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon edit" 
                          title="Edit Department"
                          onClick={() => navigate(`/admin/departments/${dept.id}/edit`)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          title="Delete Department"
                          onClick={() => handleDeleteClick(dept)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;
