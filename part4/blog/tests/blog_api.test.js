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

after(async () => {
    await mongoose.connection.close()
})
