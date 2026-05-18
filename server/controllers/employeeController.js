// controllers/employeeController.js - Employee controller
const Employee = require('../models/Employee');

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees with pagination, sorting, and filtering
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const { 
      search = '', 
      department = '', 
      sortBy = 'performanceScore', 
      order = 'desc', 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (department) {
      query.department = department;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const employees = await Employee.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (employee) {
      res.json(employee);
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
      res.json({ message: 'Employee removed' });
    } else {
      res.status(404);
      throw new Error('Employee not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
