const { test, beforeEach, after, describe } = require("node:test")
const assert = require("node:assert")
const app = require("../app")
const supertest = require("supertest")
const helper = require("./test_helper")
const Blog = require("../models/blog")
const User = require("../models/user")
const mongoose = require("mongoose")
const _ = require("lodash")
const jwt = require("jsonwebtoken")

const api = supertest(app)

const initializeDb = async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    const { password: password1, ...user1 } = helper.initialUsers[0]
    const { password: password2, ...user2 } = helper.initialUsers[1]

    const createBlogs = async (user, blogs) => {
        for (const blog of blogs) {
            await helper.getOrCreateBlog(user, blog)
        }
    }
    const h = helper.initialBlogs
    await Promise.all([createBlogs(user1, [h[0], h[1], h[2]]), createBlogs(user2, [h[3], h[4], h[5]])])
}

const getTestingToken = async () => {
    const { passwordHash, name, ...user} = helper.initialUsers[0]
    const token = (await api.post("/api/login").send(user)).body.token
    return token
}

describe("when there is initially some blogs saved", () => {
    beforeEach(async () => {
        await initializeDb()
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

    test("'Likes' default to 0 when ommited from request", async () => {
        const token = await getTestingToken()
        const newBlog = {
            title: "'Likes' default to 0 when ommited from request",
            author: "bailan jer",
            url: "http://test", 
        }

        const { id } = (await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `Bearer ${token}`)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        ).body

        const blogsAtEnd = await helper.blogsInDb()
        assert(_.find(blogsAtEnd, { id }).likes === 0)
    })

    })

describe("when there is initially a user in the database", () => {
    beforeEach(async () => {
        await initializeDb()
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
        test("succeeds with status code 201 when `username` and `password` are supplied, both are 3 letters long and `username` is unique", async () => {
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
                username: "mlukkai",
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
            const token = await getTestingToken()
            const user = jwt.decode(token)
            const blog = {
                title: "Things I Don't Know as of 2018",
                url: "https://overreacted.io/things-i-dont-know-as-off-2018",
                author: "Dan Abramov",
            }
            const response = await api.post("/api/blogs").send(blog).set("Authorization", `Bearer ${token}`)
            const expectedStatus = 201
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            assert.strictEqual(response.body.user, user.id)

            const blogsInDb = await helper.blogsInDb()
            const savedBlog = blogsInDb.find(b => response.body.id === b.id)
            assert(savedBlog.user.toString() === user.id)
        })
            
        test("`blogs` field of user with blogs created by the user succeeds", async () => {
            const token = await getTestingToken()
            const user = jwt.decode(token)
            const blog = {
                url: "https://martinfowler.com/articles/distributed-objects-microservices.html",
                title: "Microservices and the First Law of Distributed Object",
                author: "Martin Fowler",
            }
            const response = await api.post("/api/blogs").send(blog).set("Authorization", `Bearer ${token}`)
            const expectedStatus = 201
            assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)
            assert.strictEqual(response.body.user, user.id)

            const usersInDb = await helper.usersInDb()
            const savedUser = usersInDb.find(u => u.id === user.id)
            assert(savedUser.blogs.map(b => b.toString()).includes(response.body.id))
        })
    })
})

describe("Deletion of a blog", () => {
    beforeEach(async () => {
        await initializeDb()
    })

    test("fails when token is not provided", async () => {
        const oneRandomBlog = (await helper.blogsInDb())[0]
        const response = await api.delete(`/api/blogs/${oneRandomBlog.id}`)
        const expectedStatus = 401
        assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${JSON.stringify(response.body)}`)

        assert(response.body["error"].includes("Token required"))
    })

    test("fails with status 404 when the id does not exist and token is provided", async () => {
        const nonExistingId = helper.nonExistingId()        
        const token = await getTestingToken()
        const response = await api.delete(`/api/blogs/${nonExistingId}`).set("Authorization", `Bearer ${token}`)
        const expectedStatus = 404
        assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${JSON.stringify(response.body)}`)
    })

    test("fails with status 401 when token is valid but not the creator of that blog", async () => {
        const token = await getTestingToken()
        const blogId = (await Blog.findOne(helper.initialBlogs.at(-1)))._id
        const response = (await api.delete(`/api/blogs/${blogId}`).set("Authorization", `Bearer ${token}`))
        const expectedStatus = 401
        assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${JSON.stringify(response.body)}`)
        assert(response.body.error.includes("Not author of this blog"))
    })

    test("succeeds with status code 204 when token is valid and is the creator of blog", async () => {
        const numBlogsAtStart = (await helper.blogsInDb()).length
        const token = await getTestingToken()
        const blogId = (await Blog.findOne(helper.initialBlogs[0]))._id
        const response = await api.delete(`/api/blogs/${blogId}`).set("Authorization", `Bearer ${token}`)
        const expectedStatus = 204
        assert.strictEqual(response.status, expectedStatus, `Expected ${expectedStatus}, got ${response.status}\n${response.body}`)

        const numBlogsAtEnd = (await helper.blogsInDb()).length
        assert.strictEqual(numBlogsAtEnd, numBlogsAtStart - 1)
    })
})

describe("addition of a new blog", () => {
    beforeEach(async () => {
        await initializeDb()
    })

    test("succeeds with status 201 when with valid data and valid token", async () => {
        const token = await getTestingToken()
        const newBlog = {
            title: "a valid blog is added",
            author: "bailan baler",
            url: "http://test",
            likes: 10,
        }

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set("Authorization", `Bearer ${token}`)
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

    test("fails with status 401 if token is not provided", async () => {
        const blog = {
            title: "token not provided",
            author: "J. Madagascarj",
            url: "http://local/j-madagascar",
        }

        const response = await api.post("/api/blogs").send(blog)
        const expectedState = 401
        assert.strictEqual(response.status, expectedState, `Expected ${expectedState}, got ${response.status}\n${JSON.stringify(response.body)}`)
        assert(response.body.error.includes("Missing token"))
    })
})

describe("updating of a blog", () => {
    beforeEach(async () => {
        await initializeDb()
    })
    test("succeeds with status code 200 if id is valid", async () => {
        const blogToUpdateId = helper.initialBlogs[0]._id
        const blogToUpdate = await Blog.findById(blogToUpdateId).lean()
        const token = await getTestingToken()
        const newBlog = { ...blogToUpdate, title: "testing of update"}

        await api
            .put(`/api/blogs/${newBlog._id.toString()}`)
            .send(newBlog)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .expect("Content-Type", /application\/json/)
        const updatedBlog = await Blog.findById(blogToUpdate._id).lean()
        assert.deepStrictEqual(updatedBlog, newBlog)
        })

    test("fails with status code 401 if token not provided", async () => {
        const blogToUpdateId = helper.initialBlogs[0]._id
        const blogToUpdate = await Blog.findById(blogToUpdateId).lean()
        await api.put(`/api/blogs/${blogToUpdateId}`).send(blogToUpdate).expect(401)
    })
})


after(async () => {
    await mongoose.connection.close()
})
