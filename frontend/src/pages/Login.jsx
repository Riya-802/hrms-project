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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 px-4 py-12 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-700/50 mb-3 shadow-inner">
            {role === 'admin' ? <ShieldCheck size={32} className="text-blue-500" /> : <UserCheck size={32} className="text-emerald-500" />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">HRMS Portal</h1>
          <p className="text-xs font-medium text-slate-400 mt-1">Human Resource Management System</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-xl mb-6 border border-slate-700/50">
          <button 
            type="button" 
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-semibold transition cursor-pointer ${
              role === 'admin' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleRoleToggle('admin')}
          >
            <ShieldCheck size={18} />
            <span>Admin Portal</span>
          </button>

          <button 
            type="button" 
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-xs font-semibold transition cursor-pointer ${
              role === 'employee' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => handleRoleToggle('employee')}
          >
            <UserCheck size={18} />
            <span>Employee Portal</span>
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-center text-xs font-semibold text-red-400 mb-5">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Unique Employee ID */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {role === 'admin' ? 'Admin Unique ID' : 'Employee ID / Unique ID'}
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-slate-400 pointer-events-none" size={18} />
              <input 
                type="text" 
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder={role === 'admin' ? 'e.g. ADM001' : 'e.g. EMP001'}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400 pointer-events-none" size={18} />
              <input 
                type="email" 
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={18} />
              <input 
                type="password" 
                className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition cursor-pointer disabled:opacity-50" 
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Authenticating...' : `Sign In to ${role === 'admin' ? 'Admin Portal' : 'Employee Workspace'}`}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Sparkles size={14} className="text-blue-500" />
          <span>v2.4 PostgreSQL Enterprise Edition • Protected & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
