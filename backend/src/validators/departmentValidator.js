const { body } = require('express-validator');

const createDepartmentValidation = [
  body('department_name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters.'),
  
  body('description')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive.')
];

const updateDepartmentValidation = [
  body('department_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department name cannot be empty.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Department name must be between 2 and 100 characters.'),
  
  body('description')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status must be either Active or Inactive.')
];

module.exports = {
  createDepartmentValidation,
  updateDepartmentValidation
};
