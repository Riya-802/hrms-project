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
    <div className="create-task-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Tasks</span>
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '10px', color: '#0284c7' }}>
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Create New Task</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Assign deliverables to PostgreSQL employees</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>
              Task Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input 
              type="text" 
              name="title"
              className="form-control" 
              placeholder="e.g., Complete Q3 Code Review & PR Verification" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>
              Description & Objectives
            </label>
            <textarea 
              name="description"
              className="form-control" 
              rows={4} 
              placeholder="Provide clear step-by-step guidelines, requirements, and deliverables for this task..." 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>

          {/* Assigned To - Dynamic Select from PostgreSQL DB */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>
              Assign To Employee (PostgreSQL Staff Database) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select 
              name="assigned_to"
              className="form-control" 
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
            <small style={{ color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
              Populated dynamically from all active staff stored in your PostgreSQL database.
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Priority */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Priority Level</label>
              <select 
                name="priority"
                className="form-control" 
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
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Status</label>
              <select 
                name="status"
                className="form-control" 
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Due Date</label>
              <input 
                type="date" 
                name="due_date"
                className="form-control" 
                value={formData.due_date} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
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
