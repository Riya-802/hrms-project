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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Create New Department</h2>
        <p className="text-sm text-slate-500">Add a new operational department to structure company employees</p>
      </div>

      <DepartmentForm isEdit={false} onSubmitHandler={handleAddSubmit} />
    </div>
  );
};

export default AddDepartment;
