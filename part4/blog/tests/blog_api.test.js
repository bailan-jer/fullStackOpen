const { test, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const mongoose = require("mongoose")
const _ = require("lodash")

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test("All blogs are returned and as JSON", async () => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test("Unique identifier property of blog post is 'id' and '_id' is deleted", async () => {
    // const blogs = (await helper.blogsInDb()).map(blog => blog.toJSON())
    const blogs = (await api.get("/api/blogs")).body

    // check all id's are unique
    const ids = _.countBy(blogs, blog => blog.id)
    assert(_.every(Object.values(ids), count => count === 1))

    // check _id's are deleted from blogs object
    assert(blogs.map(blog => !("_id" in blog)))
})

test("a valid blog is added", async () => {
    const newBlog = {
        title: "a valid blog is added",
        author: "bailan baler",
        url: "http://test",
        likes: 10,
    }

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert(_.some(blogsAtEnd, newBlog))
})

test("'Likes' default to 0 when ommited from request", async () => {
    const newBlog = {
        title: "'Likes' default to 0 when ommited from request",
        author: "bailan jer",
        url: "http://test", 
    }

    const { id } = (await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    ).body

    const blogsAtEnd = await helper.blogsInDb()
    assert(_.find(blogsAtEnd, { id }).likes === 0)
})

test("Missing 'title' or 'url' properties returns error 400", async () => {
    const missingTitle = {
        author: "bailan jer",
        url: "http://test",
    }
    const missingUrl = {
        title: "missing url",
        author: "bailan jer",
    }
    const missingTitleAndUrl = {
        author: "bailan jer"
    }

    await api
        .post("/api/blogs")
        .send(missingTitle)
        .expect(400)

    await api
        .post("/api/blogs")
        .send(missingUrl)
        .expect(400)

    await api
        .post("/api/blogs")
        .send(missingTitleAndUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})
