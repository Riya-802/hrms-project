import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useHRMS, formatCurrency, parseSalaryNum } from '../context/HRMSContext';

const EmployeeTable = ({ employees = [] }) => {
  const navigate = useNavigate();
  const { openModal, deleteEmployee } = useHRMS();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(employees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = (employee) => {
    openModal({
      title: 'Delete Employee',
      message: `Are you sure you want to delete "${employee.fullName}" (${employee.employeeId || employee.employee_id || employee.id})? This action cannot be undone.`,
      confirmText: 'Delete Employee',
      type: 'danger',
      onConfirm: () => {
        deleteEmployee(employee.id);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm min-w-[768px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-extrabold text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className="px-5 py-3.5 whitespace-nowrap">Employee ID</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Employee Name</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Phone</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Designation</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Department</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Joining Date</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Salary</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                  <td className="px-5 py-4 font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {emp.employeeId || emp.employee_id || emp.id}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={emp.profilePhoto} 
                        alt={emp.fullName} 
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{emp.fullName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{emp.phone}</td>
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">{emp.designation}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{emp.department}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{emp.joiningDate}</td>
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(parseSalaryNum(emp.salary))}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition" 
                        title="View Details"
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition" 
                        title="Edit Employee"
                        onClick={() => navigate(`/admin/employees/${emp.id}/edit`)}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition" 
                        title="Delete Employee"
                        onClick={() => handleDeleteClick(emp)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-10 text-slate-400 font-medium">
                  No employees found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {employees.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 dark:text-slate-200">{startIndex + 1}</strong> to <strong className="text-slate-800 dark:text-slate-200">{Math.min(startIndex + itemsPerPage, employees.length)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{employees.length}</strong> employees
          </div>
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                  currentPage === pageNum 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button 
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
