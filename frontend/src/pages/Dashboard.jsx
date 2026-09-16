import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  UserPlus, 
  List, 
  Building,
  DollarSign,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  ChevronRight,
  Megaphone,
  Gift,
  Laptop,
  Plus,
  X,
  ExternalLink,
  MapPin,
  RotateCw
} from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import StatusBadge from '../components/StatusBadge';
import { useHRMS } from '../context/HRMSContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    stats, 
    employees, 
    leaves, 
    tasks, 
    announcements, 
    milestones, 
    approveLeave, 
    rejectLeave, 
    toggleTaskStatus, 
    addAnnouncement,
    t,
    currentFormattedDate 
  } = useHRMS();

  // Modal State for Attendance Category View
  const [selectedCategoryModal, setSelectedCategoryModal] = useState(null); // 'inOffice', 'remote', 'leave', 'late'

  // Post Announcement State
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Event');

  const maxDeptPayroll = Math.max(...stats.departmentCounts.map((d) => d.payroll), 1);

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAnnouncement({
      title: newTitle,
      content: newContent || 'No details provided.',
      category: newCategory,
      priority: 'Normal'
    });
    setNewTitle('');
    setNewContent('');
    setShowAnnounceModal(false);
  };

  const getActiveModalCategoryData = () => {
    if (selectedCategoryModal === 'inOffice') {
      return {
        title: `Staff Currently In Office (${stats.inOfficeStaff.length})`,
        list: stats.inOfficeStaff,
        color: '#047857',
        bg: '#ecfdf5'
      };
    }
    if (selectedCategoryModal === 'remote') {
      return {
        title: `Staff Working Remotely (${stats.remoteStaff.length})`,
        list: stats.remoteStaff,
        color: '#1e40af',
        bg: '#eff6ff'
      };
    }
    if (selectedCategoryModal === 'leave') {
      return {
        title: `Staff On Approved Leave (${stats.onLeaveStaff.length})`,
        list: stats.onLeaveStaff,
        color: '#b45309',
        bg: '#fffbeb'
      };
    }
    if (selectedCategoryModal === 'late') {
      return {
        title: `Late Clock-in Records (0)`,
        list: stats.lateStaff,
        color: '#475569',
        bg: '#f1f5f9'
      };
    }
    return null;
  };

  const activeCategoryModalData = getActiveModalCategoryData();

  return (
    <div>
      {/* 1. Executive Welcome Hero Banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', background: 'rgba(255, 255, 255, 0.18)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HRMS Admin Center
            </span>
            <span style={{ fontSize: '0.78rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
              <Activity size={14} color="#60a5fa" /> {t('systemOperational')}
            </span>
          </div>
          <h2>{t('welcomeBack')}</h2>
          <p>{t('realtimeOversight')}</p>
        </div>

        <div className="dashboard-hero-stats">
          <div className="hero-stat-badge">
            <Calendar size={18} color="#93c5fd" />
            <span>{currentFormattedDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Workforce Attendance & Location Status Cards */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent)" />
            <span>{t('todayWorkforceStatus')}</span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {t('clickCardRoster')}
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            
            {/* IN OFFICE CARD (5 Staff) */}
            <div 
              onClick={() => setSelectedCategoryModal('inOffice')}
              style={{
                padding: '1.1rem 1.25rem',
                backgroundColor: '#ecfdf5',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #a7f3d0',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('inOffice')}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#065f46' }}>{stats.inOfficeStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} color="#047857" />
              </div>

              {/* Avatar Stack preview */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(4, 120, 87, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {stats.inOfficeStaff.slice(0, 4).map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        marginLeft: i > 0 ? '-8px' : 0,
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#047857' }}>{t('whoIsHere')} &rarr;</span>
              </div>
            </div>

            {/* WORKING REMOTE CARD (2 Staff) */}
            <div 
              onClick={() => setSelectedCategoryModal('remote')}
              style={{
                padding: '1.1rem 1.25rem',
                backgroundColor: '#eff6ff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Laptop size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('workingRemote')}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e3a8a' }}>{stats.remoteStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} color="#1e40af" />
              </div>

              {/* Avatar Stack preview */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(30, 64, 175, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {stats.remoteStaff.map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        marginLeft: i > 0 ? '-8px' : 0,
                        objectFit: 'cover'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1e40af' }}>{t('whoIsRemote')} &rarr;</span>
              </div>
            </div>

            {/* ON APPROVED LEAVE CARD (4 Staff) */}
            <div 
              onClick={() => setSelectedCategoryModal('leave')}
              style={{
                padding: '1.1rem 1.25rem',
                backgroundColor: '#fffbeb',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fde68a',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('onApprovedLeave')}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#92400e' }}>{stats.onLeaveStaff.length} Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} color="#b45309" />
              </div>

              {/* Avatar Stack preview */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(180, 83, 9, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {stats.onLeaveStaff.slice(0, 4).map((emp, i) => (
                    <img 
                      key={emp.id}
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        marginLeft: i > 0 ? '-8px' : 0,
                        objectFit: 'cover'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#b45309' }}>{t('whoIsOnLeave')} &rarr;</span>
              </div>
            </div>

            {/* LATE CLOCK-INS CARD (0 Staff) */}
            <div 
              onClick={() => setSelectedCategoryModal('late')}
              style={{
                padding: '1.1rem 1.25rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ffffff', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('lateClockIns')}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>0 Staff</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700' }}>✓ {t('allStaffOnTime')}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Details &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Stat Cards Grid - 3-Column Equal Layout */}
      <div className="stat-cards-grid-3">
        <div className="stat-card-enhanced blue">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">{t('totalEmployees')}</div>
              <div className="stat-card-value">{stats.totalEmployees}</div>
            </div>
            <div className="stat-icon-wrapper blue">
              <Users size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill up">
              <TrendingUp size={12} /> +8.4%
            </span>
            <span style={{ color: 'var(--text-muted)' }}>vs previous quarter</span>
          </div>
        </div>

        <div className="stat-card-enhanced green">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">{t('activeStaff')}</div>
              <div className="stat-card-value">{stats.activeEmployees}</div>
            </div>
            <div className="stat-icon-wrapper green">
              <UserCheck size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill up">
              {stats.totalEmployees > 0 ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 0}% Active Rate
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{stats.inactiveEmployees} inactive</span>
          </div>
        </div>

        <div className="stat-card-enhanced amber">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">{t('totalPayroll')}</div>
              <div className="stat-card-value">{stats.formattedTotalSalary}</div>
            </div>
            <div className="stat-icon-wrapper amber">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill neutral">
              Avg: {stats.formattedAvgSalary} / yr
            </span>
            <span style={{ color: 'var(--text-muted)' }}>annual total</span>
          </div>
        </div>

        <div className="stat-card-enhanced purple">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">{t('upcomingLeaves')}</div>
              <div className="stat-card-value">{stats.pendingLeavesCount} Requests</div>
            </div>
            <div className="stat-icon-wrapper purple">
              <CalendarCheck size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill amber">
              <Clock size={12} /> Action Needed
            </span>
            <span style={{ color: 'var(--text-muted)' }}>pending approval</span>
          </div>
        </div>

        <div className="stat-card-enhanced blue">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Pending HR Tasks</div>
              <div className="stat-card-value">{stats.pendingTasksCount} Tasks</div>
            </div>
            <div className="stat-icon-wrapper blue">
              <CheckSquare size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill neutral">
              {tasks.filter((t) => t.priority === 'High').length} High Priority
            </span>
            <span style={{ color: 'var(--text-muted)' }}>in pipeline</span>
          </div>
        </div>

        <div className="stat-card-enhanced green">
          <div className="stat-card-top">
            <div>
              <div className="stat-card-title">Total Departments</div>
              <div className="stat-card-value">{stats.totalDepartments} Units</div>
            </div>
            <div className="stat-icon-wrapper green">
              <Building2 size={24} />
            </div>
          </div>
          <div className="stat-card-footer">
            <span className="trend-pill up">
              100% Operational
            </span>
            <span style={{ color: 'var(--text-muted)' }}>active units</span>
          </div>
        </div>
      </div>

      {/* 4. Company Notice Board & Upcoming Milestones Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Company Announcements Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Megaphone size={18} color="var(--accent)" />
              <span>Company Notice Board & Broadcasts</span>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
              onClick={() => setShowAnnounceModal(true)}
            >
              <Plus size={14} /> Post Notice
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {ann.title}
                      </span>
                      <span 
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: ann.category === 'Event' ? '#eff6ff' : ann.category === 'Compliance' ? '#fffbeb' : '#f1f5f9',
                          color: ann.category === 'Event' ? '#1e40af' : ann.category === 'Compliance' ? '#b45309' : '#475569'
                        }}
                      >
                        {ann.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {ann.content}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: '600' }}>
                      Posted on: {ann.date}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0', fontSize: '0.88rem' }}>
                  No company notices posted. Click "Post Notice" to broadcast an update.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Today Card (Reference Image Style) */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{t('today')}</h3>
            <button className="btn-icon" onClick={() => addToast('Today events refreshed.', 'info')} title="Refresh Today Events">
              <RotateCw size={16} />
            </button>
          </div>
          <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {employees.filter(e => e.status === 'On Leave').length > 0 ? (
                employees.filter(e => e.status === 'On Leave').map((emp) => (
                  <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={18} />
                      </div>
                      <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                        {emp.fullName} is on approved leave today
                      </span>
                    </div>
                    <img 
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  </div>
                ))
              ) : employees.length > 0 ? (
                employees.slice(0, 3).map((emp) => (
                  <div key={emp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={18} />
                      </div>
                      <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>
                        {emp.fullName} &bull; {emp.designation} ({emp.department})
                      </span>
                    </div>
                    <img 
                      src={emp.profilePhoto} 
                      alt={emp.fullName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0', fontSize: '0.88rem' }}>
                  No active employee events scheduled for today.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Quick Actions */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div className="card-header-title">{t('quickActions')}</div>
        </div>
        <div className="card-body">
          <div className="quick-actions-bar">
            <div className="quick-action-card" onClick={() => navigate('/admin/employees/add')}>
              <div className="quick-action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
                <UserPlus size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{t('addEmployee')}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>Register new staff member</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>

            <div className="quick-action-card" onClick={() => navigate('/admin/employees')}>
              <div className="quick-action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                <List size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{t('viewDirectory')}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>Browse employee roster</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>

            <div className="quick-action-card" onClick={() => navigate('/admin/departments')}>
              <div className="quick-action-icon-wrapper" style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}>
                <Building size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{t('manageDepartments')}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '400' }}>Organize department teams</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Visual Charts & Analytics Section */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div className="page-header-text">
          <h2>Analytics & Visual Reports</h2>
          <p>Workforce distribution, budget allocations, and key operational metrics</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Department Headcount Visual Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChartIcon size={18} color="var(--accent)" />
              <span>Department Headcount Share</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                <svg width="150" height="150" viewBox="0 0 42 42" className="donut">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e8f0" strokeWidth="6" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="40 60" strokeDashoffset="25" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="85" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="65" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="47" />
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ec4899" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="35" />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.totalEmployees}</span>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Staff</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {stats.departmentCounts.map((dept, index) => {
                  const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={dept.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{dept.name}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{dept.employeeCount} staff</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Department Payroll Breakdown Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--accent)" />
              <span>Department Payroll Expenditure</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {stats.departmentCounts.map((dept) => {
                const percentage = Math.round((dept.payroll / maxDeptPayroll) * 100);
                return (
                  <div key={dept.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-main)' }}>{dept.name}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{dept.formattedPayroll}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #1e3a8a, #2563eb)',
                          borderRadius: '4px'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 7. Pending Leaves & Pending Tasks Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Pending Leaves Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#f59e0b" />
              <span>Pending Leave Requests ({leaves.filter((l) => l.status === 'Pending').length})</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '1rem 1.5rem' }}>
            {leaves.filter((l) => l.status === 'Pending').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leaves
                  .filter((l) => l.status === 'Pending')
                  .map((leave) => (
                    <div 
                      key={leave.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                          {leave.employeeName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {leave.leaveType} &bull; <strong>{leave.days} day(s)</strong> ({leave.startDate} to {leave.endDate})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem', italic: 'true' }}>
                          "{leave.reason}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          className="btn-icon view" 
                          title="Approve Leave"
                          onClick={() => approveLeave(leave.id)}
                          style={{ backgroundColor: '#ecfdf5', color: '#10b981', borderColor: '#a7f3d0' }}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          title="Reject Leave"
                          onClick={() => rejectLeave(leave.id)}
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                No pending leave requests at this time.
              </div>
            )}
          </div>
        </div>

        {/* Pending HR Tasks Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={18} color="var(--accent)" />
              <span>Administrative Task Pipeline</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {tasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: task.status === 'Completed' ? '#f8fafc' : '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    opacity: task.status === 'Completed' ? 0.65 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input 
                      type="checkbox" 
                      checked={task.status === 'Completed'} 
                      onChange={() => {}} 
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <div>
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: '0.88rem',
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none' 
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Due: {task.dueDate} &bull; Assigned: {task.assignedTo}
                      </div>
                    </div>
                  </div>

                  <span 
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: task.priority === 'High' ? '#fef2f2' : task.priority === 'Medium' ? '#fffbeb' : '#f1f5f9',
                      color: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#d97706' : '#64748b'
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 8. Recent Employees Directory */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div className="page-header-text">
          <h2>Recent Employees Roster</h2>
          <p>Latest staff members onboarded into the HRMS database</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/employees')}>
          View Full Directory
        </button>
      </div>

      <EmployeeTable employees={employees.slice(0, 5)} />

      {/* Attendance Category Roster Modal */}
      {selectedCategoryModal && activeCategoryModalData && (
        <div className="modal-overlay" onClick={() => setSelectedCategoryModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header" style={{ backgroundColor: activeCategoryModalData.bg }}>
              <h3 style={{ color: activeCategoryModalData.color }}>{activeCategoryModalData.title}</h3>
              <button className="toast-close" onClick={() => setSelectedCategoryModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {activeCategoryModalData.list.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeCategoryModalData.list.map((emp) => (
                    <div 
                      key={emp.id}
                      style={{
                        padding: '0.85rem 1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img 
                          src={emp.profilePhoto} 
                          alt={emp.fullName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.92rem' }}>
                            {emp.fullName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {emp.designation} &bull; <strong>{emp.department}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: '700', color: activeCategoryModalData.color, background: activeCategoryModalData.bg, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                          {emp.time ? `Clocked in: ${emp.time}` : emp.leaveType ? emp.leaveType : emp.status}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          ID: {emp.id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  No employees in this category today.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedCategoryModal(null)}>
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {showAnnounceModal && (
        <div className="modal-overlay" onClick={() => setShowAnnounceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Post Company Notice / Broadcast</h3>
              <button className="toast-close" onClick={() => setShowAnnounceModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePostAnnouncement}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Announcement Title <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Q4 Company All-Hands Meeting" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="form-control"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Event">Event</option>
                    <option value="Compliance">Compliance & Policy</option>
                    <option value="Holiday">Holiday & Closure</option>
                    <option value="General">General Notice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Announcement Details</label>
                  <textarea 
                    rows="3"
                    className="form-control" 
                    placeholder="Write announcement details..." 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnounceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
