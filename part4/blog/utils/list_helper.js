const lodash = require("lodash")

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (accumulator, currentValue) => {
		return accumulator + currentValue.likes 
	}
	return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
	return blogs.length > 0  
			? blogs.reduce((max, current) => {
				return current.likes > max.likes ? current : max
			})
			: null
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null
	const blogsCount = lodash.countBy(blogs, blog => blog.author)
	const result = lodash.maxBy(Object.entries(blogsCount), ([key, value]) => value)
	return { author: result[0], blogs: result[1] }
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) return null
	const likesCount = lodash.reduce(blogs, (authorLikes, blog) => {
		const name = blog.author
		authorLikes[name] = (authorLikes[name] || 0) + blog.likes
		return authorLikes
	}, {})
	const result = lodash.maxBy(Object.entries(likesCount), ([key, value]) => value)
	return { author: result[0], likes: result[1] }
}

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs, 
	mostLikes,
}
