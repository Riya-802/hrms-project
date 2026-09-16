import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DepartmentForm = ({ initialValues, isEdit = false, onSubmitHandler }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    status: initialValues?.status || 'Active'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmitHandler(formData);
  };

  return (
    <div className="form-card" style={{ maxWidth: '650px' }}>
      <form onSubmit={handleSubmit}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          {/* Department Name */}
          <div className="form-group">
            <label>Department Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Human Resources"
              className={`form-control ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              rows="4" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Briefly describe the responsibilities and scope of this department..."
              className="form-control"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-control">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/admin/departments')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Department' : 'Save Department'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;
