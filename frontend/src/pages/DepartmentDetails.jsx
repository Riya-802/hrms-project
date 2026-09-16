import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Users, Building2, DollarSign, Search, ShieldCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import EmployeeTable from '../components/EmployeeTable';
import { useHRMS, formatCurrency, parseSalaryNum } from '../context/HRMSContext';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartmentById, employees, openModal, deleteDepartment } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');

  const department = getDepartmentById(id);

  if (!department) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Department Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          No department records found for ID "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/departments')}>
          Back to Departments
        </button>
      </div>
    );
  }

  const assignedEmployees = employees.filter((e) => e.department === department.name);

  const filteredAssignedEmployees = useMemo(() => {
    return assignedEmployees.filter((emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignedEmployees, searchTerm]);

  const totalDeptPayroll = assignedEmployees.reduce((acc, curr) => acc + parseSalaryNum(curr.salary), 0);
  const formattedDeptPayroll = formatCurrency(totalDeptPayroll);

  const handleDelete = () => {
    openModal({
      title: 'Delete Department',
      message: `Are you sure you want to delete department "${department.name}" (${department.id})?`,
      confirmText: 'Delete Department',
      type: 'danger',
      onConfirm: () => {
        deleteDepartment(department.id);
        navigate('/admin/departments');
      }
    });
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/departments')}>
          <ArrowLeft size={16} />
          <span>Back to Departments</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/admin/departments/${department.id}/edit`)}>
            <Edit3 size={16} />
            <span>Edit Department</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete Department</span>
          </button>
        </div>
      </div>

      {/* Department Banner & Overview */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div 
          style={{
            height: '100px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
            position: 'relative'
          }}
        />

        <div className="card-body" style={{ marginTop: '-40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end' }}>
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)',
                  border: '3px solid #ffffff'
                }}
              >
                <Building2 size={40} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>{department.name}</h2>
                  <StatusBadge status={department.status} />
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Department Code: <strong>{department.id}</strong>
                </div>
              </div>
            </div>

            {/* Department Headcount & Payroll Metrics */}
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Staff</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={18} />
                  <span>{assignedEmployees.length}</span>
                </div>
              </div>

              <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Annual Budget</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <DollarSign size={18} />
                  <span>{formattedDeptPayroll}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.3rem' }}>
              Department Description & Mandate
            </div>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {department.description || 'No description provided for this department.'}
            </p>
          </div>
        </div>
      </div>

      {/* Department Staff Roster */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div className="page-header-text">
          <h3>Department Staff Roster ({assignedEmployees.length})</h3>
          <p>Employees currently registered under the {department.name} department</p>
        </div>

        <div className="search-input-wrapper" style={{ minWidth: '280px' }}>
          <Search className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search staff in department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <EmployeeTable employees={filteredAssignedEmployees} />
    </div>
  );
};

export default DepartmentDetails;
