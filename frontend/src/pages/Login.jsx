import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

const Login = () => {
  const { login, addToast } = useHRMS();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@hrms.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('admin'); // 'admin' | 'employee'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email address.', 'danger');
      return;
    }

    const loggedUser = login(email, password, role);
    if (loggedUser) {
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@hrms.com');
    setPassword('admin123');
    setRole('admin');
    const loggedUser = login('admin@hrms.com', 'admin123', 'admin');
    navigate('/admin/dashboard');
  };

  const handleDemoEmployee = () => {
    setEmail('employee@hrms.com');
    setPassword('emp123');
    setRole('employee');
    const loggedUser = login('employee@hrms.com', 'emp123', 'employee');
    navigate('/employee/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo-badge">
            <ShieldCheck size={32} color="#2563eb" />
          </div>
          <h1 className="login-title">HRMS Portal</h1>
          <p className="login-subtitle">Human Resource Management System</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="login-role-toggle">
          <button 
            type="button" 
            className={`role-toggle-btn ${role === 'admin' ? 'active-admin' : ''}`}
            onClick={() => {
              setRole('admin');
              setEmail('admin@hrms.com');
            }}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>

          <button 
            type="button" 
            className={`role-toggle-btn ${role === 'employee' ? 'active-employee' : ''}`}
            onClick={() => {
              setRole('employee');
              setEmail('employee@hrms.com');
            }}
          >
            <UserCheck size={18} />
            <span>Employee Self-Service</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="login-submit-btn">
            <span>Sign In to {role === 'admin' ? 'Admin Portal' : 'Employee Workspace'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="login-demo-section">
          <div className="demo-divider">
            <span>OR QUICK LOGIN FOR DEMO</span>
          </div>
          <div className="demo-buttons">
            <button type="button" className="btn btn-outline btn-demo-admin" onClick={handleDemoAdmin}>
              <ShieldCheck size={16} />
              <span>Login as Admin</span>
            </button>
            <button type="button" className="btn btn-outline btn-demo-employee" onClick={handleDemoEmployee}>
              <UserCheck size={16} />
              <span>Login as Employee</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <Sparkles size={14} color="#3b82f6" />
          <span>v2.4 Enterprise Edition • Protected & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
