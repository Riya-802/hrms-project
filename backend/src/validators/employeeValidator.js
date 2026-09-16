const { body } = require('express-validator');

const createEmployeeValidation = [
  body('employee_id')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Employee ID cannot be empty if provided.'),

  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  body('date_of_birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Gender must be Male, Female, Other, or Prefer not to say.'),

  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required.'),

  body('department_id')
    .notEmpty()
    .withMessage('Department ID is required.')
    .isInt({ min: 1 })
    .withMessage('Department ID must be a positive integer.'),

  body('joining_date')
    .notEmpty()
    .withMessage('Joining date is required.')
    .isISO8601()
    .withMessage('Joining date must be a valid date (YYYY-MM-DD).'),

  body('employment_type')
    .optional()
    .customSanitizer((val) => {
      if (!val) return val;
      if (val === 'Full-Time') return 'Full-time';
      if (val === 'Part-Time') return 'Part-time';
      return val;
    })
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    .withMessage('Employment type must be Full-time, Part-time, Contract, or Internship.'),

  body('salary')
    .notEmpty()
    .withMessage('Salary is required.')
    .isFloat({ min: 0 })
    .withMessage('Salary must be a non-negative number.'),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'On Leave', 'Terminated'])
    .withMessage('Status must be Active, Inactive, On Leave, or Terminated.'),

  body('address')
    .optional()
    .trim(),

  body('profile_photo')
    .optional()
    .trim()
];

const updateEmployeeValidation = [
  body('full_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty.'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim(),

  body('date_of_birth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD).'),

  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Gender must be Male, Female, Other, or Prefer not to say.'),

  body('designation')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Designation cannot be empty.'),

  body('department_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Department ID must be a positive integer.'),

  body('joining_date')
    .optional()
    .isISO8601()
    .withMessage('Joining date must be a valid date (YYYY-MM-DD).'),

  body('employment_type')
    .optional()
    .customSanitizer((val) => {
      if (!val) return val;
      if (val === 'Full-Time') return 'Full-time';
      if (val === 'Part-Time') return 'Part-time';
      return val;
    })
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    .withMessage('Employment type must be Full-time, Part-time, Contract, or Internship.'),

  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a non-negative number.'),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'On Leave', 'Terminated'])
    .withMessage('Status must be Active, Inactive, On Leave, or Terminated.'),

  body('address')
    .optional()
    .trim(),

  body('profile_photo')
    .optional()
    .trim()
];

module.exports = {
  createEmployeeValidation,
  updateEmployeeValidation
};
