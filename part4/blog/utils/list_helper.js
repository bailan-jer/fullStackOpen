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

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
	mostBlogs, 
}
