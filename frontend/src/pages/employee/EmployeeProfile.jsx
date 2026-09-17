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
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src={photo} 
            alt={empName} 
            className="h-20 w-20 rounded-full border-4 border-white/20 object-cover shadow-lg bg-white" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256';
            }}
          />
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-200">
              PERSONAL PROFILE
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">{empName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-1">
              <span className="flex items-center gap-1.5"><Briefcase size={15} className="text-blue-400" /> {empDesignation}</span>
              <span className="flex items-center gap-1.5"><Shield size={15} className="text-blue-400" /> ID: {empId}</span>
              <span className="flex items-center gap-1.5"><User size={15} className="text-blue-400" /> {empDept}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 font-semibold text-slate-900 text-sm">
            Personal Information
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <User size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</div>
                  <div className="text-sm font-semibold text-slate-900">{empName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Mail size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</div>
                  <div className="text-sm font-semibold text-slate-900">{user?.email || 'employee@hrms.com'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Phone size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</div>
                  <div className="text-sm font-semibold text-slate-900">{user?.phone || '+1 555-0199'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <MapPin size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Address</div>
                  <div className="text-sm font-semibold text-slate-900">{user?.address || '123 Innovation Drive, Tech Park, Suite 400'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 font-semibold text-slate-900 text-sm">
            Job & Position Information
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Briefcase size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Designation</div>
                  <div className="text-sm font-semibold text-slate-900">{empDesignation}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Award size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</div>
                  <div className="text-sm font-semibold text-slate-900">{empDept}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <Calendar size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date of Joining</div>
                  <div className="text-sm font-semibold text-slate-900">{user?.joiningDate || '2022-06-10'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <DollarSign size={18} className="text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Annual Gross Salary</div>
                  <div className="text-sm font-semibold text-slate-900">{user?.salary ? formatCurrency(user.salary) : '$95,000'}</div>
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
