import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Users, 
  UserCheck, 
  DollarSign, 
  Briefcase,
  Filter,
  X
} from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import { useHRMS } from '../context/HRMSContext';

const Employees = () => {
  const navigate = useNavigate();
  const { employees, departments, stats } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const hasActiveFilters = searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All';

  return (
    <div className="space-y-6">
      {/* 1. Page Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
              HR Workforce Directory
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Employee Directory</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Search, filter, and manage all registered staff profiles and employment records.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-blue-100 border border-white/20 backdrop-blur-xs">
            <Users size={18} className="text-blue-300" />
            <span>{stats.totalEmployees} Total Staff</span>
          </div>

          <button 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition cursor-pointer" 
            onClick={() => navigate('/admin/employees/add')}
          >
            <UserPlus size={18} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Enhanced Toolbar / Filter Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, ID, designation, email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Department Dropdown */}
            <select 
              className="rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select 
              className="rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button 
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('All');
                setSelectedStatus('All');
              }}
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* Filter Status Summary Tag */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500 gap-2">
          <span>
            Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> registered employees
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <UserCheck size={16} /> {stats.activeEmployees} Active Members
          </span>
        </div>
      </div>

      {/* 3. Employee Directory Table */}
      <EmployeeTable employees={filteredEmployees} />
    </div>
  );
};

export default Employees;
