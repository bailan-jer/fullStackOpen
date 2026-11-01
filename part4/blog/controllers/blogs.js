const blogsRouter = require("express").Router()
const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1, }) 
    return response.json(blogs)
})

blogsRouter.get("/:id", async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate("user", { username: 1, name: 1, }) 
    return response.json(blog)
})

const randomUser = async () => {
    const User = require("../models/user")
    const usersInDb = await User.find({})
    if (usersInDb.length > 0) {
        return usersInDb[0]
    }
    throw new Error("No user in database yet")
}

blogsRouter.post("/", async (request, response) => {
    if (!request.body.url || !request.body.title) {
        return response.status(400).end()
    }
    const user = await randomUser()
    const blog = new Blog({
        ...request.body,
        likes: request.body.likes || 0,
        user: user._id,
    })

    await blog.save()
    user.blogs = user.blogs.concat(blog._id)
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
