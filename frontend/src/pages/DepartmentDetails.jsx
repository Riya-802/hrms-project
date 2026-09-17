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
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm max-w-md mx-auto my-8">
        <h3 className="text-lg font-bold text-slate-900">Department Not Found</h3>
        <p className="text-sm text-slate-500 my-4">
          No department records found for ID "{id}".
        </p>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm" 
          onClick={() => navigate('/admin/departments')}
        >
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
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs" 
          onClick={() => navigate('/admin/departments')}
        >
          <ArrowLeft size={16} />
          <span>Back to Departments</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-xs" 
            onClick={() => navigate(`/admin/departments/${department.id}/edit`)}
          >
            <Edit3 size={16} />
            <span>Edit Department</span>
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition cursor-pointer shadow-xs" 
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Delete Department</span>
          </button>
        </div>
      </div>

      {/* Department Banner & Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-600" />

        <div className="-mt-10 p-6 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md border-4 border-white">
                <Building2 size={40} />
              </div>
              <div className="mb-1 space-y-0.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">{department.name}</h2>
                  <StatusBadge status={department.status} />
                </div>
                <div className="text-sm text-slate-500">
                  Department Code: <strong className="text-slate-800">{department.id}</strong>
                </div>
              </div>
            </div>

            {/* Department Headcount & Payroll Metrics */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 px-5 py-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Assigned Staff</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-xl font-extrabold text-blue-900">
                  <Users size={18} />
                  <span>{assignedEmployees.length}</span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-5 py-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Annual Budget</div>
                <div className="mt-0.5 flex items-center gap-1 text-xl font-extrabold text-emerald-900">
                  <DollarSign size={18} />
                  <span>{formattedDeptPayroll}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Department Description & Mandate
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {department.description || 'No description provided for this department.'}
            </p>
          </div>
        </div>
      </div>

      {/* Department Staff Roster */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Department Staff Roster ({assignedEmployees.length})</h3>
          <p className="text-xs text-slate-500">Employees currently registered under the {department.name} department</p>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search staff in department..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </div>

      <EmployeeTable employees={filteredAssignedEmployees} />
    </div>
  );
};

export default DepartmentDetails;
