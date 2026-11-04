const logger = require("./logger")
const _  = require("lodash")

const unknownEndpointHandler = (request, response) => {
    logger.info(request.path)
    return response.status(404).json({ error: "Unknown Endpoint" })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error)
    console.log(error)

    if (error.name === "ValidationError") {
        return response.status(400).json({ error: `${_.join(Object.keys(error.errors))} invalid`})
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
        return response.status(400).json({ error: "`username` is expected to be unique" })
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

module.exports = {
    unknownEndpointHandler,
    errorHandler,
    tokenExtractor,
}
