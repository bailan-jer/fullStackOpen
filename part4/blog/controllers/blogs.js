const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const notes = await Blog.find({}) 
    return response.json(notes)
})

blogsRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body)

    return response.status(201).json(await blog.save()) 
})

module.exports = blogsRouter
