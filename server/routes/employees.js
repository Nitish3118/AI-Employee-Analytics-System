// routes/employees.js - Employee management routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const employeeValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').isIn(['Engineering','HR','Marketing','Sales','Finance','Design','Operations']).withMessage('Invalid department'),
  body('performanceScore').isNumeric().custom(val => val >= 0 && val <= 100).withMessage('Score must be between 0 and 100')
];

router.route('/')
  .post(protect, employeeValidation, validate, createEmployee)
  .get(protect, getEmployees);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, employeeValidation, validate, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
