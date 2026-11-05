import Blog from "./Blog"
import BlogForm from "./BlogForm"

const Blogs = ({ user, blogs, onLogout, onBlogCreate }) => {
    return (
        <div>
            <h2>Blogs</h2>
            <p>
                {user.username} logged in
                <button onClick = {onLogout}>logout</button>
            </p>
            <BlogForm onBlogCreate = {onBlogCreate} />

            {blogs.map(b => <Blog key = {b.id} blog = {b} />)}
        </div>
    )
}

export default Blogs