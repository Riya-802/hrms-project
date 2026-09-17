import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Building2, 
  DollarSign, 
  UserCheck,
  CreditCard,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useHRMS, getSalaryBreakdown } from '../context/HRMSContext';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, openModal, deleteEmployee } = useHRMS();

  const employee = getEmployeeById(id);

  if (!employee) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Employee Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          No employee records match the ID "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/employees')}>
          Back to Employee Directory
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    openModal({
      title: 'Delete Employee',
      message: `Are you sure you want to remove "${employee.fullName}" (${employee.employeeId || employee.employee_id || employee.id}) from HRMS?`,
      confirmText: 'Delete Employee',
      type: 'danger',
      onConfirm: () => {
        deleteEmployee(employee.id);
        navigate('/admin/employees');
      }
    });
  };

  // Salary breakdown details
  const salaryDetails = getSalaryBreakdown(employee.salary);

  return (
    <div>
      {/* Top Controls */}
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/employees')}>
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}>
            <Edit3 size={16} />
            <span>Edit Employee</span>
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} />
            <span>Delete Employee</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="profile-card" style={{ marginBottom: '2rem' }}>
        <div className="profile-banner" />
        
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <img 
              src={employee.profilePhoto} 
              alt={employee.fullName} 
              className="profile-avatar"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
              }}
            />
            <div className="profile-title-text">
              <h3>{employee.fullName}</h3>
              <p>{employee.designation} &bull; {employee.department}</p>
            </div>
          </div>

          <div>
            <StatusBadge status={employee.status} />
          </div>
        </div>

        {/* Detailed Grid Info */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={14} /> Employee ID
              </span>
            </div>
            <div className="info-value">{employee.employeeId || employee.employee_id || employee.id}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} /> Email Address
              </span>
            </div>
            <div className="info-value">{employee.email}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} /> Phone Number
              </span>
            </div>
            <div className="info-value">{employee.phone}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> Date of Birth
              </span>
            </div>
            <div className="info-value">
              {employee.dob && employee.dob !== 'N/A' 
                ? String(employee.dob).split('T')[0] 
                : (employee.date_of_birth ? String(employee.date_of_birth).split('T')[0] : 'N/A')}
            </div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} /> Gender
              </span>
            </div>
            <div className="info-value">{employee.gender || 'N/A'}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={14} /> Department
              </span>
            </div>
            <div className="info-value">{employee.department}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> Joining Date
              </span>
            </div>
            <div className="info-value">{employee.joiningDate}</div>
          </div>

          <div className="info-item">
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={14} /> Employment Type
              </span>
            </div>
            <div className="info-value">{employee.employmentType}</div>
          </div>

          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
            <div className="info-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} /> Residential Address
              </span>
            </div>
            <div className="info-value">{employee.address || 'No address provided'}</div>
          </div>
        </div>
      </div>

      {/* Salary & Financial Compensation Details Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="#10b981" />
            <span>Salary & Compensation Breakdown</span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.2rem', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>
                Annual Gross Salary
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#065f46', marginTop: '0.3rem' }}>
                {salaryDetails.formattedGrossAnnual}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.2rem' }}>
                Agreed base annual package
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>
                Monthly Net Payable
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e3a8a', marginTop: '0.3rem' }}>
                {salaryDetails.formattedNetPayable} <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>/ mo</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#1e40af', marginTop: '0.2rem' }}>
                Estimated direct deposit amount
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Base Component (70%)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                {salaryDetails.formattedBaseSalary} <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>/ mo</span>
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Allowances & Perks (20%)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.3rem' }}>
                {salaryDetails.formattedAllowances} <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>/ mo</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CreditCard size={20} color="var(--accent)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Payroll Payment Method: <strong>Direct Bank Transfer</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '600' }}>
              <ShieldCheck size={18} />
              <span>Payroll Active & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
