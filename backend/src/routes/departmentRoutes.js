const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  getDepartmentById, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} = require('../controllers/departmentController');
const { 
  createDepartmentValidation, 
  updateDepartmentValidation 
} = require('../validators/departmentValidator');
const { validate } = require('../middleware/validationMiddleware');

router.get('/', getDepartments);
router.get('/:id', getDepartmentById);
router.post('/', createDepartmentValidation, validate, createDepartment);
router.put('/:id', updateDepartmentValidation, validate, updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
