import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';
import { useHRMS } from '../context/HRMSContext';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { addEmployee } = useHRMS();

  const handleAddSubmit = async (formData) => {
    const res = await addEmployee(formData);
    if (res) {
      navigate('/admin/employees');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Add New Employee</h2>
        <p className="text-sm text-slate-500">Complete the form below to register a new employee into the system</p>
      </div>

      <EmployeeForm isEdit={false} onSubmitHandler={handleAddSubmit} />
    </div>
  );
};

export default AddEmployee;
