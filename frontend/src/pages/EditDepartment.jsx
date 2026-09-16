import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DepartmentForm from '../components/DepartmentForm';
import { useHRMS } from '../context/HRMSContext';

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDepartmentById, updateDepartment } = useHRMS();

  const department = getDepartmentById(id);

  if (!department) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Department Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Unable to find department record with ID "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/departments')}>
          Return to Departments
        </button>
      </div>
    );
  }

  const handleEditSubmit = (updatedFields) => {
    updateDepartment(id, updatedFields);
    navigate(`/admin/departments/${id}`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Edit Department: {department.name} ({department.id})</h2>
          <p>Modify department title, description, or activation status</p>
        </div>
      </div>

      <DepartmentForm 
        initialValues={department} 
        isEdit={true} 
        onSubmitHandler={handleEditSubmit} 
      />
    </div>
  );
};

export default EditDepartment;
