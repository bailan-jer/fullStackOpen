const express = require("express")
const mongoose = require("mongoose")
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs")
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
const usersRouter = require("./controllers/users")

const app = express()
logger.info("connecting to", config.MONGODB_URI)

const mongoUrl = config.MONGODB_URI
mongoose
	.connect(mongoUrl, { family: 4 })
	.then(() => {
		logger.info("connected to mongoDB")
	})
	.catch(error => {
		logger.error("error connecting to MongoDB", error.message)
	})

app.use(express.json())
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)
app.use(middleware.unknownEndpointHandler)

module.exports = app
