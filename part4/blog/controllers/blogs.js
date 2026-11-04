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
    const token = request.token
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
    const blogToDeleteId = request.params.id
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: "Token required" })
    }
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: "Invalid token" })
    }
    const userId = decodedToken.id
    const user = await User.findById(userId)
    if (!user) {
        return response.status(401).json({ error: "Missing userId or userId invalid"})
    }

    const blogToDelete = await Blog.findById(blogToDeleteId)
    if (!blogToDelete) {
        return response.status(404).end()
    }
    if (blogToDelete.user.toString() === userId.toString()) {
        user.blogs = user.blogs.filter(id => id.toString() !== blogToDeleteId)
        await user.save()
        const deleteSuccess = await blogToDelete.deleteOne()
        if (deleteSuccess) {
            return response.status(204).end()
        }
    }
    return response.status(401).json({ error: "Not author of this blog" })
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
