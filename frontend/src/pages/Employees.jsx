import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Users, 
  UserCheck, 
  DollarSign, 
  Briefcase,
  Filter,
  X
} from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import { useHRMS } from '../context/HRMSContext';

const Employees = () => {
  const navigate = useNavigate();
  const { employees, departments, stats } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedStatus]);

  const hasActiveFilters = searchTerm || selectedDepartment !== 'All' || selectedStatus !== 'All';

  return (
    <div>
      {/* 1. Page Hero Header */}
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
              HR Workforce Directory
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Employee Directory</h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Search, filter, and manage all registered staff profiles and employment records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.6rem 1.1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={18} color="#93c5fd" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{stats.totalEmployees} Total Staff</span>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/admin/employees/add')} style={{ padding: '0.75rem 1.4rem' }}>
            <UserPlus size={18} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Enhanced Toolbar / Filter Controls */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
              {/* Search input */}
              <div className="search-input-wrapper" style={{ minWidth: '300px', flex: 1 }}>
                <Search className="navbar-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name, ID, designation, email..." 
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

              {/* Department Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  className="select-filter"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="All">All Departments ({departments.length})</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <select 
                className="select-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('All');
                  setSelectedStatus('All');
                }}
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Filter Status Summary Tag */}
          <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>
              Showing <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> registered employees
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: '600' }}>
              <UserCheck size={16} /> {stats.activeEmployees} Active Members
            </span>
          </div>
        </div>
      </div>

      {/* 3. Employee Directory Table */}
      <EmployeeTable employees={filteredEmployees} />
    </div>
  );
};

export default Employees;
