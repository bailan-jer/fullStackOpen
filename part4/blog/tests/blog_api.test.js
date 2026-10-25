const { test, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const mongoose = require("mongoose")

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

after(async () => {
    await mongoose.connection.close()
})
