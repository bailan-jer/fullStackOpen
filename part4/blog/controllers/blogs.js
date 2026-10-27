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

blogsRouter.delete("/:id", async (request, response) => {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    if (deletedBlog) {
        return response.status(204).end()
    }
    return response.status(404).end()
})

blogsRouter.put("/:id", async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).end()
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body)
    if (updatedBlog) {
        return response.status(200).json(updatedBlog)
    }
    return response.status(404).end()
})

module.exports = blogsRouter
