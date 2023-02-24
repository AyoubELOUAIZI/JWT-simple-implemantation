const path = require('path');  // import the built-in `path` module
const express = require('express');  // import the `express` framework
const colors = require('colors');  // import the `colors` library for console logs
const dotenv = require('dotenv').config();  // load environment variables from .env file
const { errorHandler } = require('./middleware/errorMiddleware');  // import custom error handling middleware
const connectDB = require('./config/db');  // import the function to connect to the database
const port = process.env.PORT || 5000;  // set the port to listen on, either from the environment variable or default to 5000

connectDB();  // connect to the database

const app = express();  // create a new instance of the Express application

app.use(express.json());  // parse incoming JSON data
app.use(express.urlencoded({ extended: false }));  // parse incoming URL-encoded data



app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    // if in production mode, serve the static files from the frontend build folder
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // for all other requests, serve the index.html file from the frontend build folder
    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
        )
    );
} else {
    // if not in production mode, respond with a message to set to production
    app.get('/', (req, res) => res.send('Please set to production'));
}

app.use(errorHandler);  // add the custom error handling middleware to the application

app.listen(port, () => console.log(`Server started on port ${port}`));  // start the server and listen on the specified port, log a message when it starts
