import { useState } from "react"

const Blog = ({ blog, deleteBlog, user, incrementLike }) => {
    const [detailsVisible, setDetailVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    }

    const onDelete = async () => {
        deleteBlog(blog)
    }

    const onLikeClicked = async () => {
        await incrementLike({
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id,
        })
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
                {blog.likes} <button onClick={onLikeClicked}>Like</button>
                <br />
                {blog.user.name}
                <br />
                { user.id === blog.user.id ? <button style = {deleteButtonStyle} onClick = { onDelete }>delete</button> : null}
            </div>
        )
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button
                    onClick={() => {
                        setDetailVisible(!detailsVisible)
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
