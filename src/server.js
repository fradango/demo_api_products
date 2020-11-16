require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
require('./database');

//Set env vars
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

//Middlewares
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//Routes
app.use('/api/v1/products', require('./routes/products'));

//Listening server
app.listen(PORT, console.log(`Server running in ${NODE_ENV} on port ${PORT}`));
