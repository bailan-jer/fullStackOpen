const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, }) 
    return response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1, }) 
    return response.json(blog)
})

blogsRouter.post("/", userExtractor, async (request, response) => {
    if (!request.body.url || !request.body.title) {
        return response.status(400).end()
    }
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: "Missing token"})
    }
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: "Missing userId or invalid userId" })
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

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
    const blogToDeleteId = request.params.id
    const token = request.token
    if (!token) {
        return response.status(401).json({ error: "Token required" })
    }
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: "Missing userId or userId invalid"})
    }

    const blogToDelete = await Blog.findById(blogToDeleteId)
    if (!blogToDelete) {
        return response.status(404).end()
    }
    if (blogToDelete.user.toString() === user._id.toString()) {
        user.blogs = user.blogs.filter(id => id.toString() !== blogToDeleteId)
        await user.save()
        const deleteSuccess = await blogToDelete.deleteOne()
        if (deleteSuccess) {
            return response.status(204).end()
        }
    }
    return response.status(401).json({ error: "Not author of this blog" })
})

blogsRouter.put("/:id", userExtractor, async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).json({ error: "Missing title or url" })
    }

    const blogId = request.params.id
    const blog = await Blog.findById(blogId)
    if (!blog) {
        return response.status(404).json({ error: "Blog not found" })
    }
    const creatorId = blog.user.toString()
    const requestUser = request.user
    if (!requestUser) {
        return response.status(401).json({ error: "Token invalid" })
    }
    if (creatorId != requestUser._id.toString()) {
        return response.status(401).json({ error: "Not author of this blog" })
    }
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, request.body, { returnDocument: "after", })
    return response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
