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
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Add New Employee</h2>
          <p>Complete the form below to register a new employee into the system</p>
        </div>
      </div>

      <EmployeeForm isEdit={false} onSubmitHandler={handleAddSubmit} />
    </div>
  );
};

export default AddEmployee;
