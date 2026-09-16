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
    <div className="employee-page-container">
      <div className="emp-metrics-grid">
        <div className="emp-metric-card">
          <div className="metric-icon-box bg-blue">
            <Briefcase size={22} color="#2563eb" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Assigned</span>
            <h3 className="metric-value">{activeTasks.length} Tasks</h3>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-amber">
            <Clock size={22} color="#d97706" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Pending Action</span>
            <h3 className="metric-value">{activeTasks.filter(t => t.status !== 'Completed').length} Pending</h3>
          </div>
        </div>

        <div className="emp-metric-card">
          <div className="metric-icon-box bg-green">
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Completed</span>
            <h3 className="metric-value">{activeTasks.filter(t => t.status === 'Completed').length} Done</h3>
          </div>
        </div>
      </div>

      <div className="emp-card" style={{ marginTop: '1.5rem' }}>
        <div className="emp-card-header">
          <h3>Assigned Work Items</h3>
        </div>
        <div className="emp-card-body">
          <div className="task-list">
            {activeTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={task.status === 'Completed'} 
                  onChange={() => toggleTaskStatus(task.id)}
                  className="task-checkbox"
                />
                <div className="task-details">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`priority-tag priority-${(task.priority || 'Medium').toLowerCase()}`}>
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
