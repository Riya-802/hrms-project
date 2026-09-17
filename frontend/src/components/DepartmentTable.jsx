import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit3, Trash2, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const DepartmentTable = ({ departments = [] }) => {
  const navigate = useNavigate();
  const { openModal, deleteDepartment, employees } = useHRMS();

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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-4 py-3.5 whitespace-nowrap">Dept ID</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Department Name</th>
              <th className="px-4 py-3.5">Description</th>
              <th className="px-4 py-3.5 whitespace-nowrap text-center">No. of Employees</th>
              <th className="px-4 py-3.5 whitespace-nowrap text-center">Status</th>
              <th className="px-4 py-3.5 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {departments.length > 0 ? (
              departments.map((dept) => {
                const count = employees.filter((e) => e.department === dept.name).length;
                return (
                  <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-blue-600 whitespace-nowrap">{dept.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">{dept.name}</td>
                    <td className="px-4 py-3.5 max-w-[380px] whitespace-normal break-words text-slate-500 text-xs leading-relaxed">
                      {dept.description}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                        <Users size={16} className="text-blue-600" />
                        <span>{count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      <StatusBadge status={dept.status} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer" 
                          title="View Department Details"
                          onClick={() => navigate(`/admin/departments/${dept.id}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition cursor-pointer" 
                          title="Edit Department"
                          onClick={() => navigate(`/admin/departments/${dept.id}/edit`)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition cursor-pointer" 
                          title="Delete Department"
                          onClick={() => handleDeleteClick(dept)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-500">
                  No departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;
