// Define an error handling middleware function called errorHandler
const errorHandler = (err, req, res, next) => {
    console.log('the errorHandler is worked ******')
    // Determine the HTTP status code to use in the response
    const statusCode = res.statusCode ? res.statusCode : 500

    // Set the HTTP status code of the response to the determined status code
    res.status(statusCode)

    // Send a JSON response with an error message and stack trace (in development mode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}

// Export an object with the errorHandler function as a property
module.exports = {
    errorHandler,
}
