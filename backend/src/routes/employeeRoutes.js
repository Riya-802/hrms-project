const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const {
  createEmployeeValidation,
  updateEmployeeValidation
} = require('../validators/employeeValidator');
const { validate } = require('../middleware/validationMiddleware');

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployeeValidation, validate, createEmployee);
router.put('/:id', updateEmployeeValidation, validate, updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
