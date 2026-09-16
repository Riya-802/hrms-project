import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const Login = () => {
  const { login, addToast } = useHRMS();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState('ADM001');
  const [email, setEmail] = useState('admin@hrms.com');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('admin'); // 'admin' | 'employee'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleToggle = (targetRole) => {
    setRole(targetRole);
    setErrorMessage('');
    if (targetRole === 'admin') {
      setEmployeeId('ADM001');
      setEmail('admin@hrms.com');
      setPassword('admin123');
    } else {
      setEmployeeId('EMP001');
      setEmail('aarav.sharma@company.com');
      setPassword('emp123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!employeeId && !email) {
      setErrorMessage('Please enter your Employee Unique ID or Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await login({
        employee_id: employeeId.trim(),
        email: email.trim(),
        password: password,
        role: role
      });

      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          addToast('Authenticated as Admin successfully.', 'success');
          navigate('/admin/dashboard');
        } else {
          addToast(`Authenticated as ${loggedUser.fullName || loggedUser.full_name} successfully.`, 'success');
          navigate('/employee/dashboard');
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Invalid Employee ID, Email or Password.');
      addToast(error.message || 'Authentication rejected.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-badge">
            {role === 'admin' ? <ShieldCheck size={32} color="#2563eb" /> : <UserCheck size={32} color="#10b981" />}
          </div>
          <h1 className="login-title">HRMS Portal</h1>
          <p className="login-subtitle">Human Resource Management System</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="login-role-toggle">
          <button 
            type="button" 
            className={`role-toggle-btn ${role === 'admin' ? 'active-admin' : ''}`}
            onClick={() => handleRoleToggle('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>

          <button 
            type="button" 
            className={`role-toggle-btn ${role === 'employee' ? 'active-employee' : ''}`}
            onClick={() => handleRoleToggle('employee')}
          >
            <UserCheck size={18} />
            <span>Employee Self-Service</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.825rem', fontWeight: 600, marginBottom: '1.25rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Unique Employee ID */}
          <div className="form-group">
            <label className="form-label">{role === 'admin' ? 'Admin Unique ID' : 'Employee ID / Unique ID'}</label>
            <div className="input-with-icon">
              <User className="field-icon" size={18} />
              <input 
                type="text" 
                className="form-control login-input"
                placeholder={role === 'admin' ? 'e.g. ADM001' : 'e.g. EMP001'}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="field-icon" size={18} />
              <input 
                type="email" 
                className="form-control login-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="field-icon" size={18} />
              <input 
                type="password" 
                className="form-control login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Authenticating...' : `Sign In to ${role === 'admin' ? 'Admin Portal' : 'Employee Workspace'}`}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <Sparkles size={14} color="#3b82f6" />
          <span>v2.4 PostgreSQL Enterprise Edition • Protected & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
