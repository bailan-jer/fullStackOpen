import Blog from "./Blog"
import lodash from "lodash"

const Blogs = ({ blogs, setBlogs, user }) => {
    const updateBlogs = (incrementedBlog) => {
        setBlogs(
            lodash.orderBy(
                blogs.map((b) =>
                    b.id === incrementedBlog.id ? incrementedBlog : b,
                ),
                ["likes"],
                ["asc"],
            ),
        )
    }

    const deleteBlog = (deletedBlogId) => {
        setBlogs(blogs.filter((b) => b.id !== deletedBlogId))
    }

    return (
        <div>
            {blogs.map((b) => (
                <Blog
                    key={b.id}
                    blog={b}
                    updateBlogs={updateBlogs}
                    deleteBlog={deleteBlog}
                    user = {user}
                />
            ))}
        </div>
    )
}

export default Blogs
