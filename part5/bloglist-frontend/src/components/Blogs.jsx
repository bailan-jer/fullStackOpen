import Blog from "./Blog"

const Blogs = ({ user, blogs, onLogout }) => {
    return (
        <div>
            <h2>Blogs</h2>
            <p>
                {user.username} logged in
                <button onClick = {onLogout}>logout</button>
            </p>

            {blogs.map(b => <Blog key = {b.id} blog = {b} />)}
        </div>
    )
}

export default Blogs