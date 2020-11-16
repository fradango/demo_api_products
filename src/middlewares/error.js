const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  //Log for dev
  console.log(err);

  //Mongoose Bad ObjectId
  //GET, PUT, DELETE /:id  Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    err = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  //POST duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  //POST Don't introduce a required fields in the body
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    err = new ErrorResponse(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server error',
  });
};

module.exports = errorHandler;
