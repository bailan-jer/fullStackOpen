const logger = require("./logger")
const _  = require("lodash")
const jwt = require("jsonwebtoken")
const config = require("./config")
const User = require("../models/user")

const unknownEndpointHandler = (request, response) => {
    logger.info(request.path)
    return response.status(404).json({ error: "Unknown Endpoint" })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error)

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: `${_.join(Object.keys(error.errors))} invalid`})
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
        return response.status(400).json({ error: "`username` is expected to be unique" })
    } else if (error.name === "CastError") {
        return response.status(400).json({ error: "Malformed BlogId" })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get("Authorization", null)
    if (authorization && authorization.startsWith("Bearer")) {
        request.token = authorization.replace("Bearer ", "")
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    if (token) {
        const decodedToken = jwt.verify(token, config.SECRET)
        const id = decodedToken.id
        if (id) {
            const user = await User.findById(id)
            if (user) {
                request.user = user
            }
        }
    }
    next()
}

module.exports = {
    unknownEndpointHandler,
    errorHandler,
    tokenExtractor,
    userExtractor,
}
