import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { useHRMS } from '../context/HRMSContext';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, updateEmployee } = useHRMS();

  const employee = getEmployeeById(id);

  if (!employee) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Employee Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Unable to locate employee with ID "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/employees')}>
          Return to Employees
        </button>
      </div>
    );
  }

  const handleEditSubmit = (updatedFields) => {
    updateEmployee(id, updatedFields);
    navigate(`/admin/employees/${id}`);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Edit Employee: {employee.fullName} ({employee.id})</h2>
          <p>Modify employee credentials, designation, salary, or department placement</p>
        </div>
      </div>

      <EmployeeForm 
        initialValues={employee} 
        isEdit={true} 
        onSubmitHandler={handleEditSubmit} 
      />
    </div>
  );
};

export default EditEmployee;
