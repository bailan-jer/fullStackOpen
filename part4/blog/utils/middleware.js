const logger = require("./logger")

const unknownEndpointHandler = (request, response) => {
    logger.info(request.path)
    return response.status(404).json({ error: "Unknown Endpoint" })
}

module.exports = {
    unknownEndpointHandler,
}
