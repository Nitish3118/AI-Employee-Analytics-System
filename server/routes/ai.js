// routes/ai.js - AI recommendation routes
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/recommend',
  protect,
  [
    body('employeeId').notEmpty().withMessage('Employee ID is required')
  ],
  validate,
  getRecommendation
);

module.exports = router;
