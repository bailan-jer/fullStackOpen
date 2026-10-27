const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const notes = await Blog.find({}) 
    return response.json(notes)
})

blogsRouter.post("/", async (request, response) => {
    if (!request.body.url || !request.body.title) {
        return response.status(400).end()
    }
    const blog = new Blog(request.body)

    return response.status(201).json(await blog.save()) 
})

module.exports = blogsRouter
