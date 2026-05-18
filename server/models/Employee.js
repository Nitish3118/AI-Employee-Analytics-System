// models/Employee.js - Employee database schema
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  department: { 
    type: String, 
    required: true, 
    enum: ['Engineering','HR','Marketing','Sales','Finance','Design','Operations'] 
  },
  skills: { type: [String], default: [] },
  performanceScore: { type: Number, min: 0, max: 100, required: true },
  experience: { type: Number, min: 0, max: 50 },
  role: { type: String, default: 'Employee' },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
