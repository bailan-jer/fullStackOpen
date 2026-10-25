const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const notes = await Blog.find({}) 
    return response.json(notes)
})

blogsRouter.post("/", (request, response) => {
    const blog = new Blog(request.body)

    blog.save()
        .then(savedBlog => {
            return response.status(201).json(savedBlog)
		})
})

module.exports = blogsRouter
