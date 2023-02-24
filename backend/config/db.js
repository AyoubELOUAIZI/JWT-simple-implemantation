// Import the Mongoose library
const mongoose = require('mongoose')

// Define an asynchronous function called connectDB
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the Mongoose library
        const conn = await mongoose.connect(process.env.MONGO_URI)

        // Log a message to the console indicating that the connection was successful
        console.log('*********** nice good job **************')
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        // If there was an error connecting to the database, log the error to the console
        console.log(error)

        // Exit the process with a non-zero exit code to indicate that an error occurred
        process.exit(1)
    }
}

// Export the connectDB function so it can be used in other modules
module.exports = connectDB
