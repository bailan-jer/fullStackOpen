const { test, beforeEach, after, describe } = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")
const mongoose = require("mongoose")
const _ = require("lodash")
const bcrypt = require("bcrypt")

const api = supertest(app)

describe("when there is initially some blogs saved", () => {
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

    describe("addition of a new blog", () => {
        test("succeeds when with valid data", async () => {
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

        test("fails with status code 404 if data lacks 'title' or 'url'", async () => {
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

    describe("deletion of a blog", () => {
        test("succeeds with status code 204 if id is valid",  async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

            assert.strictEqual(await Blog.findById(blogToDelete.id), null)
        })

        test("fails with status code 404 if id does not exist", async () => {
            await api.delete(`/api/blogs/${helper.nonExistingId()}`).expect(404)
        })
    })

    describe("updating of a blog", () => {
        test("succeeds with status code 200 if id is valid", async () => {
            const noteAtStart = await helper.blogsInDb()
            const noteToUpdate = noteAtStart[0]
            const newBlog = { ...noteToUpdate, title: "testing of update"}

            await api.put(`/api/blogs/${newBlog.id}`).send(newBlog).expect(200).expect("Content-Type", /application\/json/)
        
            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlog = _.find(blogsAtEnd, blog => blog.id === newBlog.id)
            assert.deepStrictEqual(updatedBlog, newBlog)
        })
    })
})

describe("when there is initially a user in the database", () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const password = "test"
        const hashRounds = 10
        const passwordHash = await bcrypt.hash(password, hashRounds)
        const newUser = new User({
            username: "test",
            name: "test",
            passwordHash,
        })
        await newUser.save()
    })

    test("POST request to `/api/users` creates new user", async () => {
        const newUser = {
            username: "testing1",
            name: "bailan jer",
            password: "123456",
        }

        const response = await api.post("/api/users").send(newUser)
        const expectedStatus = 201
        assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
        const usersAtEnd = await helper.usersInDb()
        assert(usersAtEnd.filter(u => u.username === newUser.username))

        assert(!Object.hasOwn(response.body, "passwordHash"))
    })

    describe("creation of a new user", async () => {
        test("success with status code 201 when `username` and `password` are supplied, both are 3 letters long and `username` is unique", async () => {
            const usersAtStart = await helper.usersInDb()
            const user = {
                username: "testing2",
                name: "bailan jer",
                password: "123456",
            }

            const response = await api.post("/api/users").send(user)
            const expectedStatus = 201
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            const  usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        })

        test("failed with status code 400 when `username` length is < 3", async () => {
            const usersAtStart = await helper.usersInDb()
            const invalidUser = {
                username: "ab",
                name: "bailan",
                password: "123456",
            }

            const response = await api.post("/api/users").send(invalidUser)
            const expectedStatus = 400
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            const usersAtEnd = await helper.usersInDb()
            assert(usersAtStart.length === usersAtEnd.length)
        })

        test("failed with status code 400 when `password` length is < 3", async() => {
            const usersAtStart = await helper.usersInDb()
            const invalidUser = {
                username: "valid username",
                name: "bailan jer",
                password: "12",
            }

            const response = await api.post("/api/users").send(invalidUser)
            const expectedStatus = 400
            assert.strictEqual(response.status, 400, `Expected ${expectedStatus},got ${response.status}\n${response.body}`)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtStart.length, usersAtEnd.length)
            assert(Object.hasOwn(response.body, "error") && response.body.error.includes("password invalid"))
        })

        test("failed with status code 400 when `username` is not unique", async () => {
            const usersAtStart = await helper.usersInDb()
            const invalidUser = {
                username: "test",
                name: "test",
                password: "1234",
            }
            const response = await api.post("/api/users").send(invalidUser)
            const expectedStatus = 400
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\nbody: ${JSON.stringify(response.body)}`)
            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, usersAtStart.length)
            assert(response.body.error.includes("`username` is expected to be unique"))
        })
    })

    describe("population of", () => {
        test("`user` field of blog with the corresponding user succeeds", async () => {
            const onlyUser = (await helper.usersInDb())[0]
            const blog = {
                title: "Things I Don't Know as of 2018",
                url: "https://overreacted.io/things-i-dont-know-as-off-2018",
                author: "Dan Abramov",
            }
            const response = await api.post("/api/blogs").send(blog)
            const expectedStatus = 201
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            assert.strictEqual(response.body.user, onlyUser.id)

            const getResponse = await api.get(`/api/blogs/${response.body.id}`)
            const expectedUserObj = (await User.findById(response.body.user)).toJSON()
            delete expectedUserObj.blogs
            assert.deepStrictEqual(getResponse.body.user, expectedUserObj) })

        test("`blogs` field of user with blogs created by the user succeeds", async () => {
            const onlyUser = (await helper.usersInDb())[0]
            const blog = {
                url: "https://martinfowler.com/articles/distributed-objects-microservices.html",
                title: "Microservices and the First Law of Distributed Object",
                author: "Martin Fowler",
            }
            const response = await api.post("/api/blogs").send(blog)
            const expectedStatus = 201
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            assert.strictEqual(response.body.user, onlyUser.id)

            const getOnlyUserFromApi = await api.get(`/api/users/${response.body.user}`)
            const blogsIds = getOnlyUserFromApi.body.blogs.map(b => b.id)

            let blogs = await Blog.find({ user: response.body.user}, { _id: 1 })
            blogs = blogs.map(b => b._id.toString())
            assert(_.difference(blogs, blogsIds).length === 0)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
