const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")
const {initialBlogs: blogs} = require("./test_helper.js")

test("dummy returns one", () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	assert.strictEqual(result, 1)
})

describe("total likes", () => {
	test("of an empty list is zero", () => {
		assert.strictEqual(listHelper.totalLikes([]), 0)
	})

	test("when list only has one blog equals the likes of that", () => {
		const result = listHelper.totalLikes([blogs[0]])
		assert.strictEqual(result, 7)
	})

	test("of a bigger list is calculated right", () => {
		const result = listHelper.totalLikes(blogs)
		assert.strictEqual(result, 36)
	})
})

describe("Favourite Blog", () => {
	test("of an empty list is null", () => {
		assert.deepStrictEqual(listHelper.favouriteBlog([]), null)
	})

	test("when list only has one blog equals that blog", () => {
		assert.deepStrictEqual(listHelper.favouriteBlog([blogs[0]]), blogs[0])
	})

	test("of a bigger list is the blog with highest likes", () => {
		assert.deepStrictEqual(listHelper.favouriteBlog(blogs), blogs[2])
	})
})

describe("Most Blogs", () => {
	test("of an empty list is null", () => {
		assert.strictEqual(listHelper.mostBlogs([]), null)
	})

	test("when list only has one blog equals that blog", () => {
		assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), { author: "Michael Chan", blogs: 1 }) 
	})

	test("of a bigger list is an object with the author name and blogs count", () => {
		assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: "Robert C. Martin", blogs: 3})
	})
})

describe("Most Likes", () => {
	test("of an empty list is null", () => {
		assert.strictEqual(listHelper.mostLikes([]), null)
	})

	test("when list only has one blog equals that blog", () => {
		assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), { author: "Michael Chan", likes: 7 })
	})

	test("of a bigger list is an object with the author name and likes count", () => {
		assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: "Edsger W. Dijkstra", likes: 17 })
	})
})
