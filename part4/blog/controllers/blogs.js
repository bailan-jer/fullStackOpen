const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")
const config = require("../utils/config")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, }) 
    return response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1, }) 
    return response.json(blog)
})

const getTokenFrom = (request) => {
    const authorization = request.get("Authorization")
    if (authorization && authorization.startsWith("Bearer")) {
        return authorization.replace("Bearer ", "")
    }
    return null
}

blogsRouter.post("/", async (request, response) => {
    if (!request.body.url || !request.body.title) {
        return response.status(400).end()
    }
    const token = getTokenFrom(request)
    if (!token) {
        return response.status(401).json({ error: "Missing token"})
    }
    const decodedToken = jwt.verify(token, config.SECRET) 
    if (!decodedToken.id) {
        return response.status(401).json({ error: "invalid token" })        
    }
    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(401).json({ error: "User id missing or not valid" })
    }
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes || 0,
        user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    return response.status(201).json(blog) 
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
