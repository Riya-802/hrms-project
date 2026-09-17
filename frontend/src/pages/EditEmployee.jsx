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
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Employee Not Found</h3>
        <p className="my-3 text-sm text-slate-500">
          Unable to locate employee with ID "{id}".
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition cursor-pointer" onClick={() => navigate('/admin/employees')}>
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Edit Employee: {employee.fullName} ({employee.id})</h2>
        <p className="text-sm text-slate-500">Modify employee credentials, designation, salary, or department placement</p>
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
