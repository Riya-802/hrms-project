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
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">🔥 Urgent</span>;
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">⚡ High</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      case 'Low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Completed</span>;
      case 'In Progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">⏳ In Progress</span>;
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">⭕ Pending</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{getPageTitle()}</h1>
          <p className="text-sm text-slate-500 mt-1">Track, assign, and manage enterprise workforce deliverables</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={isAdmin ? '/admin/tasks/reports' : '/employee/tasks/reports'} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors shadow-sm"
          >
            Task Reports
          </Link>
          <Link 
            to={isAdmin ? '/admin/tasks/create' : '/employee/tasks/create'} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Tasks" value={totalCount} icon={CheckSquare} color="primary" />
        <StatCard title="Pending" value={pendingCount} icon={Clock} color="warning" />
        <StatCard title="In Progress" value={inProgressCount} icon={AlertCircle} color="info" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} color="success" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400" 
              placeholder="Search by title, description, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 w-full sm:w-auto" 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select 
              className="px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 w-full sm:w-auto" 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
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
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-600 font-medium">Loading PostgreSQL tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <CheckSquare size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900">No tasks found</h3>
          <p className="text-sm text-slate-500 mt-1">No tasks matching your current filters. Try changing filters or create a new task.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                {/* Header: ID, Priority, Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-sky-600 tracking-wider">{task.taskId}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {task.description || 'No detailed description provided.'}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Assignee & Due Date Meta */}
                <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={task.assignedToPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'} 
                      alt={task.assignedToName} 
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{task.assignedToName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{task.assignedToDesignation || task.assignedToEmpId}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                      <Calendar size={12} />
                      <span>Due</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700">{task.dueDate}</div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => toggleTaskStatus(task.id)} 
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      task.status === 'Completed' 
                        ? 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {task.status === 'Completed' ? (
                      <>
                        <Clock size={14} />
                        <span>Reopen</span>
                      </>
                    ) : task.status === 'In Progress' ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Complete</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle size={14} />
                        <span>Start Task</span>
                      </>
                    )}
                  </button>

                  <button 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" 
                    onClick={() => handleDeleteTask(task)}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
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
