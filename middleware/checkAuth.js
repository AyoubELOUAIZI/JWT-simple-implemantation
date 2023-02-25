const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();  // load environment variables from .env file


module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token')

    // CHECK IF WE EVEN HAVE A TOKEN
    if (!token) {
        return res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })

    }

    try {
        const user = await jwt.verify(token, process.env.SECRET_KEY)
        req.user = user.email
        next()
    } catch (error) {
        res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Token'
                }
            ]
        })
    }
}