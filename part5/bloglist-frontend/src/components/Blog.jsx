import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, updateBlogs, deleteBlog, user }) => {
    const [detailsVisible, setDetailsVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    }

    const incrementLike = async (event) => {
        event.preventDefault()
        const incrementedBlog = await blogService.update(
            {
                title: blog.title,
                url: blog.url,
                author: blog.author,
                user: blog.user.id,
                likes: blog.likes + 1,
            },
            blog.id,
        )
        updateBlogs(incrementedBlog)
    }

    const handleDelete = async () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.del(blog.id)
                deleteBlog(blog.id)
            } catch {
                console.log("error deleting")
            }
        }
    }

    const deleteButtonStyle = {
        backgroundColor: "#757de8",
    }

    const detail = () => {
        if (!detailsVisible) return null
        return (
            <div>
                {blog.url}
                <br />
                {blog.likes} <button onClick={incrementLike}>Like</button>
                <br />
                {blog.user.name}
                <br />
                { user.id === blog.user.id.toString() ? <button style = {deleteButtonStyle} onClick = {handleDelete}>delete</button> : null}
            </div>
        )
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button
                    onClick={() => {
                        setDetailsVisible(!detailsVisible)
                    }}
                >
                    {detailsVisible ? "hide" : "show"}
                </button>
            </div>
            {detail()}
        </div>
    )
}

export default Blog
