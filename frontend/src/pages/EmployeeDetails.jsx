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
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto my-8">
        <h3 className="text-lg font-bold text-slate-900">Employee Not Found</h3>
        <p className="text-sm text-slate-500 my-4">
          No employee records match the ID "{id}".
        </p>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm" 
          onClick={() => navigate('/admin/employees')}
        >
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
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs" 
          onClick={() => navigate('/admin/employees')}
        >
          <ArrowLeft size={16} />
          <span>Back to Employees</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs" 
            onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
          >
            <Edit3 size={16} />
            <span>Edit Employee</span>
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer shadow-xs" 
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Delete Employee</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900" />
        
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 px-6 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-end gap-5">
            <img 
              src={employee.profilePhoto} 
              alt={employee.fullName} 
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg bg-white"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
              }}
            />
            <div className="mb-1 space-y-0.5">
              <h3 className="text-xl font-bold text-slate-900">{employee.fullName}</h3>
              <p className="text-sm font-medium text-slate-500">{employee.designation} &bull; {employee.department}</p>
            </div>
          </div>

          <div className="mb-2">
            <StatusBadge status={employee.status} />
          </div>
        </div>

        {/* Detailed Grid Info */}
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase size={14} /> Employee ID
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.employeeId || employee.employee_id || employee.id}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail size={14} /> Email Address
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.email}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone size={14} /> Phone Number
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.phone}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} /> Date of Birth
            </div>
            <div className="text-sm font-bold text-slate-900">
              {employee.dob && employee.dob !== 'N/A' 
                ? String(employee.dob).split('T')[0] 
                : (employee.date_of_birth ? String(employee.date_of_birth).split('T')[0] : 'N/A')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} /> Gender
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.gender || 'N/A'}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={14} /> Department
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.department}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} /> Joining Date
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.joiningDate}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase size={14} /> Employment Type
            </div>
            <div className="text-sm font-bold text-slate-900">{employee.employmentType}</div>
          </div>

          <div className="col-span-full space-y-1 pt-2 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} /> Residential Address
            </div>
            <div className="text-sm text-slate-800">{employee.address || 'No address provided'}</div>
          </div>
        </div>
      </div>

      {/* Salary & Financial Compensation Details Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 flex items-center gap-2 font-semibold text-slate-900 text-sm">
          <DollarSign size={20} className="text-emerald-600" />
          <span>Salary & Compensation Breakdown</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Annual Gross Salary
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-900">
                {salaryDetails.formattedGrossAnnual}
              </div>
              <div className="mt-1 text-xs text-emerald-700">
                Agreed base annual package
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Monthly Net Payable
              </div>
              <div className="mt-1 text-2xl font-extrabold text-blue-900">
                {salaryDetails.formattedNetPayable} <span className="text-xs font-normal">/ mo</span>
              </div>
              <div className="mt-1 text-xs text-blue-700">
                Estimated direct deposit amount
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Base Component (70%)
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {salaryDetails.formattedBaseSalary} <span className="text-xs font-normal text-slate-500">/ mo</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Allowances & Perks (20%)
              </div>
              <div className="mt-1 text-xl font-bold text-slate-900">
                {salaryDetails.formattedAllowances} <span className="text-xs font-normal text-slate-500">/ mo</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5 text-sm">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CreditCard size={20} className="text-blue-600" />
              <span>
                Payroll Payment Method: <strong className="text-slate-900">Direct Bank Transfer</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
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
