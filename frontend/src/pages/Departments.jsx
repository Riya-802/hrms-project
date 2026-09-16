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
    <div>
      {/* 1. Page Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: '700', textTransform: 'uppercase' }}>
              Organizational Units
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Departments Management</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Structure, manage, and monitor company departments and team headcount allocations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={18} color="#93c5fd" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{stats.totalDepartments} Active Departments</span>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/admin/departments/add')} style={{ padding: '0.75rem 1.4rem' }}>
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* 2. Toolbar & View Toggle */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="search-input-wrapper" style={{ minWidth: '320px', flex: 1 }}>
              <Search className="navbar-search-icon" />
              <input 
                type="text" 
                placeholder="Search departments by name, ID, or mandate..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
              <button 
                onClick={() => setViewMode('grid')}
                className={`btn-icon ${viewMode === 'grid' ? 'view' : ''}`}
                style={{ borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)' }}
                title="Grid Cards View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`btn-icon ${viewMode === 'table' ? 'view' : ''}`}
                style={{ borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent', color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)' }}
                title="Table Directory View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Display View: Cards Grid OR Table */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => {
              const assignedEmployees = employees.filter((e) => e.department === dept.name);
              const count = assignedEmployees.length;
              return (
                <div 
                  key={dept.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div 
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800'
                          }}
                        >
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>{dept.name}</h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>ID: {dept.id}</span>
                        </div>
                      </div>

                      <StatusBadge status={dept.status} />
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', minHeight: '50px' }}>
                      {dept.description}
                    </p>

                    {/* Member Avatars & Headcount Chip */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {assignedEmployees.slice(0, 4).map((emp, i) => (
                          <img 
                            key={emp.id}
                            src={emp.profilePhoto} 
                            alt={emp.fullName}
                            style={{
                              width: '30px',
                              height: '30px',
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#eff6ff', color: '#1e40af', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: '700' }}>
                        <Users size={14} />
                        <span>{count} Staff</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div style={{ padding: '0.85rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn-icon view" 
                      title="View Department Overview"
                      onClick={() => navigate(`/admin/departments/${dept.id}`)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-icon edit" 
                      title="Edit Department Details"
                      onClick={() => navigate(`/admin/departments/${dept.id}/edit`)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="btn-icon delete" 
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
            <div className="card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
