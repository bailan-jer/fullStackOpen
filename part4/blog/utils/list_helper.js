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

module.exports = {
	dummy,
	totalLikes,
	favouriteBlog,
}
