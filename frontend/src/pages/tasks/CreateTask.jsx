import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, User, Calendar, AlertCircle, ArrowLeft } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';

const CreateTask = () => {
  const { employees, addTask, addToast } = useHRMS();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: employees.length > 0 ? employees[0].id : '',
    priority: 'Medium',
    status: 'Pending',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please enter a task title.', 'danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addTask({
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        priority: formData.priority,
        status: formData.status,
        due_date: formData.due_date
      });

      if (res) {
        navigate(isAdmin ? '/admin/tasks' : '/employee/tasks');
      }
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-sm"
      >
        <ArrowLeft size={16} />
        <span>Back to Tasks</span>
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Create New Task</h1>
            <p className="text-xs text-slate-500 mt-0.5">Assign deliverables to PostgreSQL employees</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              name="title"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all" 
              placeholder="e.g., Complete Q3 Code Review & PR Verification" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description & Objectives
            </label>
            <textarea 
              name="description"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all" 
              rows={4} 
              placeholder="Provide clear step-by-step guidelines, requirements, and deliverables for this task..." 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          {/* Assigned To - Dynamic Select from PostgreSQL DB */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Assign To Employee (PostgreSQL Staff Database) <span className="text-rose-500">*</span>
            </label>
            <select 
              name="assigned_to"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 shadow-sm transition-all" 
              value={formData.assigned_to} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Employee...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.designation}) — {emp.employeeId} [{emp.department}]
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-500 mt-1.5 block">
              Populated dynamically from all active staff stored in your PostgreSQL database.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Priority Level</label>
              <select 
                name="priority"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 shadow-sm transition-all" 
                value={formData.priority} 
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent 🔥</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select 
                name="status"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 shadow-sm transition-all" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
              <input 
                type="date" 
                name="due_date"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 shadow-sm transition-all" 
                value={formData.due_date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors bg-white shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Task...' : 'Create & Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
