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
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Department Not Found</h3>
        <p className="my-3 text-sm text-slate-500">
          Unable to find department record with ID "{id}".
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition cursor-pointer" onClick={() => navigate('/admin/departments')}>
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Edit Department: {department.name} ({department.id})</h2>
        <p className="text-sm text-slate-500">Modify department title, description, or activation status</p>
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
