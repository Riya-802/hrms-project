import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, Check, RefreshCw } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const EmployeeForm = ({ initialValues, isEdit = false, onSubmitHandler }) => {
  const navigate = useNavigate();
  const { departments, addToast } = useHRMS();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: initialValues?.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    fullName: initialValues?.fullName || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    dob: initialValues?.dob || '',
    gender: initialValues?.gender || 'Male',
    designation: initialValues?.designation || '',
    department: initialValues?.department || (departments[0]?.name || 'Human Resources'),
    joiningDate: initialValues?.joiningDate || new Date().toISOString().split('T')[0],
    employmentType: initialValues?.employmentType || 'Full-time',
    salary: initialValues?.salary || '',
    status: initialValues?.status || 'Active',
    address: initialValues?.address || '',
    profilePhoto: initialValues?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      if (addToast) addToast('Image size exceeds 5MB limit.', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      if (addToast) addToast('Real image uploaded & attached successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!String(formData.id || '').trim()) newErrors.id = 'Employee ID is required.';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required.';
    if (!formData.salary) newErrors.salary = 'Salary is required.';
    if (!isEdit && !formData.password) {
      newErrors.password = 'Initial login password is required.';
    }
    if (formData.password && formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters.';
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmitHandler(formData);
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Employee ID */}
          <div className="form-group">
            <label>Employee ID <span className="required">*</span></label>
            <input 
              type="text" 
              name="id" 
              value={formData.id} 
              onChange={handleChange}
              placeholder="e.g. EMP-101"
              className={`form-control ${errors.id ? 'error' : ''}`}
            />
            {errors.id && <span className="error-msg">{errors.id}</span>}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className={`form-control ${errors.fullName ? 'error' : ''}`}
            />
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address <span className="required">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="e.g. eleanor.vance@hrms-corp.com"
              className={`form-control ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number <span className="required">*</span></label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
              className={`form-control ${errors.phone ? 'error' : ''}`}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-control">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Designation */}
          <div className="form-group">
            <label>Designation / Job Title <span className="required">*</span></label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation} 
              onChange={handleChange}
              placeholder="e.g. Senior HR Specialist"
              className={`form-control ${errors.designation ? 'error' : ''}`}
            />
            {errors.designation && <span className="error-msg">{errors.designation}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department <span className="required">*</span></label>
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className={`form-control ${errors.department ? 'error' : ''}`}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && <span className="error-msg">{errors.department}</span>}
          </div>

          {/* Joining Date */}
          <div className="form-group">
            <label>Joining Date <span className="required">*</span></label>
            <input 
              type="date" 
              name="joiningDate" 
              value={formData.joiningDate} 
              onChange={handleChange}
              className={`form-control ${errors.joiningDate ? 'error' : ''}`}
            />
            {errors.joiningDate && <span className="error-msg">{errors.joiningDate}</span>}
          </div>

          {/* Employment Type */}
          <div className="form-group">
            <label>Employment Type</label>
            <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="form-control">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Salary */}
          <div className="form-group">
            <label>Salary (Annual / Monthly) <span className="required">*</span></label>
            <input 
              type="text" 
              name="salary" 
              value={formData.salary} 
              onChange={handleChange}
              placeholder="e.g. $85,000"
              className={`form-control ${errors.salary ? 'error' : ''}`}
            />
            {errors.salary && <span className="error-msg">{errors.salary}</span>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-control">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Account Password */}
          <div className="form-group">
            <label>Account Password {isEdit ? '(Leave blank to keep existing)' : '<span className="required">*</span>'}</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password || ''} 
              onChange={handleChange}
              placeholder={isEdit ? '••••••••' : 'Initial login password'}
              className={`form-control ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword || ''} 
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          {/* Employee Profile Photo Real Image Upload */}
          <div className="form-group full-width" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.4rem', display: 'block' }}>
              Employee Profile Photo
            </label>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '1.15rem 1.35rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {/* Image Preview Avatar */}
              <div style={{ position: 'relative', width: '76px', height: '76px', flexShrink: 0 }}>
                <img 
                  src={formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'} 
                  alt="Profile Preview"
                  style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                  }}
                />
              </div>

              {/* Upload Controls */}
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} /> Upload Image
                  </button>
                </div>
                
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click "Upload Image" to select any PNG, JPG, or WEBP photo directly from your device (Max 5MB).
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="form-group full-width">
            <label>Full Address</label>
            <textarea 
              name="address" 
              rows="3" 
              value={formData.address} 
              onChange={handleChange}
              placeholder="Enter employee residential address..."
              className="form-control"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin/employees')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
