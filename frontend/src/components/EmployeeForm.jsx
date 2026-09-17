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
    dob: initialValues?.dob ? String(initialValues.dob).split('T')[0] : (initialValues?.date_of_birth ? String(initialValues.date_of_birth).split('T')[0] : ''),
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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Employee ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Employee ID <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              name="id" 
              value={formData.id} 
              onChange={handleChange}
              placeholder="e.g. EMP-101"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.id 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.id && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.id}</span>}
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.fullName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.fullName && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="e.g. eleanor.vance@hrms-corp.com"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.email && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="e.g. +1 (555) 234-5678"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.phone 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.phone && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.phone}</span>}
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={formData.dob} 
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Designation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Designation / Job Title <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation} 
              onChange={handleChange}
              placeholder="e.g. Senior HR Specialist"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.designation 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.designation && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.designation}</span>}
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Department <span className="text-red-500 ml-0.5">*</span></label>
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 bg-white ${
                errors.department 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.department && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.department}</span>}
          </div>

          {/* Joining Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Joining Date <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="date" 
              name="joiningDate" 
              value={formData.joiningDate} 
              onChange={handleChange}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.joiningDate 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.joiningDate && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.joiningDate}</span>}
          </div>

          {/* Employment Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Employment Type</label>
            <select 
              name="employmentType" 
              value={formData.employmentType} 
              onChange={handleChange} 
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Salary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Salary (Annual / Monthly) <span className="text-red-500 ml-0.5">*</span></label>
            <input 
              type="text" 
              name="salary" 
              value={formData.salary} 
              onChange={handleChange}
              placeholder="e.g. $85,000"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.salary 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.salary && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.salary}</span>}
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Account Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Account Password {isEdit ? '(Leave blank to keep existing)' : <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input 
              type="password" 
              name="password" 
              value={formData.password || ''} 
              onChange={handleChange}
              placeholder={isEdit ? '••••••••' : 'Initial login password'}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.password && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword || ''} 
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
              }`}
            />
            {errors.confirmPassword && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.confirmPassword}</span>}
          </div>

          {/* Employee Profile Photo Real Image Upload */}
          <div className="col-span-full my-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Employee Profile Photo
            </label>
            
            <div className="flex flex-wrap items-center gap-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {/* Image Preview Avatar */}
              <div className="relative h-19 w-19 shrink-0">
                <img 
                  src={formData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'} 
                  alt="Profile Preview"
                  className="h-19 w-19 rounded-full border-4 border-white object-cover shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                  }}
                />
              </div>

              {/* Upload Controls */}
              <div className="flex min-w-[220px] flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button 
                    type="button" 
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} /> Upload Image
                  </button>
                </div>
                
                <span className="text-xs text-slate-500">
                  Click "Upload Image" to select any PNG, JPG, or WEBP photo directly from your device (Max 5MB).
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="col-span-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Full Address</label>
            <textarea 
              name="address" 
              rows="3" 
              value={formData.address} 
              onChange={handleChange}
              placeholder="Enter employee residential address..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button 
            type="button" 
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer" 
            onClick={() => navigate('/admin/employees')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition cursor-pointer"
          >
            {isEdit ? 'Update Employee' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
