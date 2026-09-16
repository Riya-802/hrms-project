import React from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from '../components/DepartmentForm';
import { useHRMS } from '../context/HRMSContext';

const AddDepartment = () => {
  const navigate = useNavigate();
  const { addDepartment } = useHRMS();

  const handleAddSubmit = (formData) => {
    addDepartment(formData);
    navigate('/admin/departments');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Create New Department</h2>
          <p>Add a new operational department to structure company employees</p>
        </div>
      </div>

      <DepartmentForm isEdit={false} onSubmitHandler={handleAddSubmit} />
    </div>
  );
};

export default AddDepartment;
