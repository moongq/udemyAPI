const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config({ path: './config/config.env'});

connectDB();

// Route files
const auth = require('./routes/auth');
const course = require('./routes/course');
const content = require('./routes/content');
const review = require('./routes/review');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/course', course);
app.use('/api/v1/content', content);
app.use('/api/v1/review', review);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, 
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

module.exports = server;