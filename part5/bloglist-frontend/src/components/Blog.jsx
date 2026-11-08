import { useState } from "react";

const Blog = ({ blog }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const detail = () => {
        if (!detailsVisible) return null;
        return (
            <div>
                {blog.url}<br />
                {blog.likes} <button>Like</button><br />
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
