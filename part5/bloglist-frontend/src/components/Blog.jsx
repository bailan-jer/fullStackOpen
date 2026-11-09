import { useState } from "react";
import blogService from "../services/blogs"

const Blog = ({ blog, updateBlogs }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const incrementLike = async (event) => {
        event.preventDefault()
        const incrementedBlog = await blogService.update({
            title: blog.title,
            url: blog.url,
            author: blog.author,
            user: blog.user.id,
            likes: blog.likes + 1
        }, blog.id)
        updateBlogs(incrementedBlog)
    }

    const detail = () => {
        if (!detailsVisible) return null;
        return (
            <div>
                {blog.url}<br />
                {blog.likes} <button onClick = {incrementLike}>Like</button><br />
                {blog.user.name}
            </div>
        );
    };

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button
                    onClick={() => {
                        setDetailsVisible(!detailsVisible);
                    }}
                >
                    {detailsVisible ? "hide" : "show"}
                </button>
            </div>
            {detail()}
        </div>
    );
};

export default Blog;
