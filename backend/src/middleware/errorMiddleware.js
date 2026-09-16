/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.originalUrl}`
  });
};

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // PostgreSQL Error Codes Handling
  if (err.code === '23505') {
    // Unique violation constraint
    statusCode = 409;
    const detail = err.detail || '';
    if (detail.includes('email')) {
      message = 'An employee with this email already exists.';
    } else if (detail.includes('employee_id')) {
      message = 'An employee with this Employee ID already exists.';
    } else if (detail.includes('department_name')) {
      message = 'A department with this name already exists.';
    } else {
      message = 'Duplicate entry conflict with existing records.';
    }
  } else if (err.code === '23503') {
    // Foreign key constraint violation
    statusCode = 400;
    if (err.detail && err.detail.includes('is still referenced')) {
      statusCode = 409;
      message = 'Cannot delete or modify record because it is referenced by active employees.';
    } else {
      message = 'Invalid reference identifier (e.g. department_id does not exist).';
    }
  } else if (err.code === '23514') {
    // Check constraint violation
    statusCode = 400;
    message = 'Invalid data value violating database check constraint.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
