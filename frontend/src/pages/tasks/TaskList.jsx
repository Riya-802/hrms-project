import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  Trash2,
  Edit,
  CheckSquare,
  PlayCircle
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import StatCard from '../../components/StatCard';

const TaskList = ({ filterMode = 'all' }) => {
  const { tasks, user, toggleTaskStatus, deleteTask, openModal, addToast, isLoading } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState(() => {
    if (filterMode === 'pending') return 'Pending';
    if (filterMode === 'in-progress') return 'In Progress';
    if (filterMode === 'completed') return 'Completed';
    return 'ALL';
  });

  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Filter tasks based on route mode and search inputs
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Route filter mode handling
      if (filterMode === 'assigned' && user) {
        const isAssigned = String(task.assignedTo) === String(user.id) || 
                           task.assignedToEmpId === user.employeeId ||
                           (user.email && task.assignedToName && task.assignedToName.toLowerCase() === user.fullName?.toLowerCase());
        if (!isAssigned) return false;
      }
      if (filterMode === 'pending' && task.status !== 'Pending') return false;
      if (filterMode === 'in-progress' && task.status !== 'In Progress') return false;
      if (filterMode === 'completed' && task.status !== 'Completed') return false;

      // Dropdown status filter
      if (selectedStatus !== 'ALL' && task.status !== selectedStatus) return false;

      // Dropdown priority filter
      if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) return false;

      // Text Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesTitle = task.title?.toLowerCase().includes(term);
        const matchesDesc = task.description?.toLowerCase().includes(term);
        const matchesAssignee = task.assignedToName?.toLowerCase().includes(term);
        const matchesId = task.taskId?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDesc && !matchesAssignee && !matchesId) return false;
      }

      return true;
    });
  }, [tasks, filterMode, user, selectedStatus, selectedPriority, searchTerm]);

  // Statistics
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  const handleDeleteTask = (task) => {
    openModal({
      title: 'Delete Task',
      message: `Are you sure you want to delete task "${task.title}" (${task.taskId})?`,
      confirmText: 'Delete Task',
      onConfirm: () => deleteTask(task.id),
      type: 'danger'
    });
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="status-badge status-inactive">🔥 Urgent</span>;
      case 'High':
        return <span className="status-badge status-on-leave">⚡ High</span>;
      case 'Medium':
        return <span className="status-badge status-active">Medium</span>;
      case 'Low':
        return <span className="status-badge status-secondary">Low</span>;
      default:
        return <span className="status-badge status-secondary">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="status-badge status-active">✓ Completed</span>;
      case 'In Progress':
        return <span className="status-badge status-on-leave">⏳ In Progress</span>;
      case 'Pending':
        return <span className="status-badge status-inactive">⭕ Pending</span>;
      default:
        return <span className="status-badge status-secondary">{status}</span>;
    }
  };

  const getPageTitle = () => {
    switch (filterMode) {
      case 'assigned': return 'My Assigned Tasks';
      case 'pending': return 'Pending Tasks';
      case 'in-progress': return 'In Progress Tasks';
      case 'completed': return 'Completed Tasks';
      default: return 'Task Management';
    }
  };

  return (
    <div className="task-page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{getPageTitle()}</h1>
          <p className="page-subtitle">Track, assign, and manage enterprise workforce deliverables</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link 
            to={isAdmin ? '/admin/tasks/reports' : '/employee/tasks/reports'} 
            className="btn btn-secondary"
          >
            Task Reports
          </Link>
          <Link 
            to={isAdmin ? '/admin/tasks/create' : '/employee/tasks/create'} 
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Total Tasks" value={totalCount} icon={CheckSquare} color="primary" />
        <StatCard title="Pending" value={pendingCount} icon={Clock} color="warning" />
        <StatCard title="In Progress" value={inProgressCount} icon={AlertCircle} color="info" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} color="success" />
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by title, description, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select 
              className="form-control" 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select 
              className="form-control" 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Grid / Cards */}
      {isLoading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading PostgreSQL tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CheckSquare size={48} style={{ margin: '0 auto 1rem', color: '#94a3b8' }} />
          <h3>No tasks found</h3>
          <p style={{ color: '#64748b' }}>No tasks matching your current filters. Try changing filters or create a new task.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredTasks.map(task => (
            <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem' }}>
              <div>
                {/* Header: ID, Priority, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0ea5e9', letterSpacing: '0.5px' }}>{task.taskId}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {task.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {task.description || 'No detailed description provided.'}
                </p>
              </div>

              <div>
                {/* Assignee & Due Date Meta */}
                <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={task.assignedToPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
                      alt={task.assignedToName} 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>{task.assignedToName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{task.assignedToDesignation || task.assignedToEmpId}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Calendar size={13} />
                      <span>Due Date</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>{task.dueDate}</div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <button 
                    onClick={() => toggleTaskStatus(task.id)} 
                    className={`btn btn-sm ${task.status === 'Completed' ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    {task.status === 'Completed' ? (
                      <>
                        <Clock size={15} />
                        <span>Reopen Task</span>
                      </>
                    ) : task.status === 'In Progress' ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>Complete Task</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle size={15} />
                        <span>Start Progress</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => handleDeleteTask(task)}
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
