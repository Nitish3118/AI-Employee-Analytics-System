// middleware/validate.js - Express validator results handler
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new Error(`Validation Error: ${errorMessages}`));
  }
  next();
};

module.exports = validate;
