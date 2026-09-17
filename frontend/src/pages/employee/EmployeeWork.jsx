import React from 'react';
import { Briefcase, CheckCircle2, Clock } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

const EmployeeWork = () => {
  const { tasks, toggleTaskStatus } = useHRMS();

  const activeTasks = tasks.length > 0 ? tasks : [
    { id: 1, title: 'Complete Q3 Code Review & PR Verification', status: 'Pending', priority: 'High', category: 'Development' },
    { id: 2, title: 'Update HRMS API Documentation & OpenAPI specs', status: 'Pending', priority: 'Medium', category: 'Documentation' },
    { id: 3, title: 'Submit Monthly Expense Reimbursement Form', status: 'Completed', priority: 'Normal', category: 'Finance' },
    { id: 4, title: 'Prepare Architecture Deck for Client Demo', status: 'Pending', priority: 'High', category: 'Design' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Total Assigned</span>
            <h3 className="text-lg font-bold text-slate-900">{activeTasks.length} Tasks</h3>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Pending Action</span>
            <h3 className="text-lg font-bold text-slate-900">{activeTasks.filter(t => t.status !== 'Completed').length} Pending</h3>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Completed</span>
            <h3 className="text-lg font-bold text-slate-900">{activeTasks.filter(t => t.status === 'Completed').length} Done</h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50 font-semibold text-slate-900 text-sm">
          Assigned Work Items
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition ${
                  task.status === 'Completed' 
                    ? 'border-slate-200 bg-slate-50 opacity-60' 
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={task.status === 'Completed'} 
                  onChange={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1 space-y-1">
                  <div className={`text-xs font-bold text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className={`font-semibold ${
                      task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span>Category: {task.category || 'General'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWork;
