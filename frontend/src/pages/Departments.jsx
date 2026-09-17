import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  Eye, 
  Edit3, 
  Trash2,
  LayoutGrid,
  List,
  CheckCircle2,
  X
} from 'lucide-react';
import DepartmentTable from '../components/DepartmentTable';
import StatusBadge from '../components/StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const Departments = () => {
  const navigate = useNavigate();
  const { departments, stats, employees, openModal, deleteDepartment } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const handleDeleteClick = (dept) => {
    const assignedCount = employees.filter((e) => e.department === dept.name).length;
    openModal({
      title: 'Delete Department',
      message: `Are you sure you want to delete department "${dept.name}" (${dept.id})? ${
        assignedCount > 0 ? `Note: ${assignedCount} employee(s) currently belong to this department.` : ''
      }`,
      confirmText: 'Delete Department',
      type: 'danger',
      onConfirm: () => {
        deleteDepartment(dept.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200 backdrop-blur-xs">
              Organizational Units
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Departments Management</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Structure, manage, and monitor company departments and team headcount allocations.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-blue-100 border border-white/20 backdrop-blur-xs">
            <Building2 size={18} className="text-blue-300" />
            <span>{stats.totalDepartments} Active Departments</span>
          </div>

          <button 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition cursor-pointer" 
            onClick={() => navigate('/admin/departments/add')}
          >
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* 2. Toolbar & View Toggle */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full sm:w-auto min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search departments..." 
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-1.5 transition cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`rounded-md p-1.5 transition cursor-pointer ${
                viewMode === 'table' 
                  ? 'bg-white text-blue-600 shadow-xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table Directory View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Display View: Cards Grid OR Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => {
              const assignedEmployees = employees.filter((e) => e.department === dept.name);
              const count = assignedEmployees.length;
              return (
                <div 
                  key={dept.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                          <span className="text-xs font-medium text-slate-500">ID: {dept.id}</span>
                        </div>
                      </div>

                      <StatusBadge status={dept.status} />
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed min-h-[48px] line-clamp-3">
                      {dept.description}
                    </p>

                    {/* Member Avatars & Headcount Chip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center">
                        {assignedEmployees.slice(0, 4).map((emp, i) => (
                          <img 
                            key={emp.id}
                            src={emp.profilePhoto} 
                            alt={emp.fullName}
                            className={`h-7 w-7 rounded-full border-2 border-white object-cover ${i > 0 ? '-ml-2' : ''}`}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                            }}
                          />
                        ))}
                      </div>

                      <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        <Users size={14} />
                        <span>{count} Staff</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-end gap-1 border-t border-slate-100 bg-slate-50 px-6 py-3">
                    <button 
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200 hover:text-blue-600 transition cursor-pointer" 
                      title="View Department Overview"
                      onClick={() => navigate(`/admin/departments/${dept.id}`)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200 hover:text-amber-600 transition cursor-pointer" 
                      title="Edit Department Details"
                      onClick={() => navigate(`/admin/departments/${dept.id}/edit`)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200 hover:text-red-600 transition cursor-pointer" 
                      title="Delete Department"
                      onClick={() => handleDeleteClick(dept)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
              No departments found matching your search.
            </div>
          )}
        </div>
      ) : (
        <DepartmentTable departments={filteredDepartments} />
      )}
    </div>
  );
};

export default Departments;
