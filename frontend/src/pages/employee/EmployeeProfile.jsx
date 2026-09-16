import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, Award, Shield } from 'lucide-react';
import { useHRMS, formatCurrency } from '../../context/HRMSContext';

const EmployeeProfile = () => {
  const { user } = useHRMS();

  const empName = user?.fullName || 'Employee Member';
  const empId = user?.employeeId || 'EMP002';
  const empDept = user?.department || 'Engineering';
  const empDesignation = user?.designation || 'Senior Software Engineer';
  const photo = user?.profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256';

  return (
    <div className="employee-page-container">
      <div className="emp-hero-card">
        <div className="emp-hero-content">
          <img src={photo} alt={empName} className="emp-hero-avatar" />
          <div className="emp-hero-details">
            <div className="emp-hero-badge">PERSONAL PROFILE</div>
            <h2>{empName}</h2>
            <div className="emp-hero-meta">
              <span><Briefcase size={15} /> {empDesignation}</span>
              <span><Shield size={15} /> ID: {empId}</span>
              <span><User size={15} /> {empDept}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="emp-main-grid" style={{ marginTop: '1.5rem' }}>
        <div className="emp-card">
          <div className="emp-card-header">
            <h3>Personal Information</h3>
          </div>
          <div className="emp-card-body">
            <div className="emp-info-grid">
              <div className="info-item">
                <User size={16} color="#64748b" />
                <div>
                  <div className="info-label">Full Name</div>
                  <div className="info-val">{empName}</div>
                </div>
              </div>
              <div className="info-item">
                <Mail size={16} color="#64748b" />
                <div>
                  <div className="info-label">Email Address</div>
                  <div className="info-val">{user?.email || 'employee@hrms.com'}</div>
                </div>
              </div>
              <div className="info-item">
                <Phone size={16} color="#64748b" />
                <div>
                  <div className="info-label">Phone Number</div>
                  <div className="info-val">{user?.phone || '+1 555-0199'}</div>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={16} color="#64748b" />
                <div>
                  <div className="info-label">Current Address</div>
                  <div className="info-val">{user?.address || '123 Innovation Drive, Tech Park, Suite 400'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="emp-card">
          <div className="emp-card-header">
            <h3>Job & Position Information</h3>
          </div>
          <div className="emp-card-body">
            <div className="emp-info-grid">
              <div className="info-item">
                <Briefcase size={16} color="#64748b" />
                <div>
                  <div className="info-label">Designation</div>
                  <div className="info-val">{empDesignation}</div>
                </div>
              </div>
              <div className="info-item">
                <Award size={16} color="#64748b" />
                <div>
                  <div className="info-label">Department</div>
                  <div className="info-val">{empDept}</div>
                </div>
              </div>
              <div className="info-item">
                <Calendar size={16} color="#64748b" />
                <div>
                  <div className="info-label">Date of Joining</div>
                  <div className="info-val">{user?.joiningDate || '2022-06-10'}</div>
                </div>
              </div>
              <div className="info-item">
                <DollarSign size={16} color="#64748b" />
                <div>
                  <div className="info-label">Annual Gross Salary</div>
                  <div className="info-val">{user?.salary ? formatCurrency(user.salary) : '$95,000'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
