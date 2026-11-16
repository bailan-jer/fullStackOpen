import Blog from "./Blog"

const Blogs = ({ blogs, user, incrementLike, deleteBlog }) => {
    return (
        <div>
            {blogs.map((b) => (
                <Blog
                    key={b.id}
                    blog={b}
                    deleteBlog={ deleteBlog }
                    user = {user}
                    incrementLike = { incrementLike }
                />
            ))}
        </div>
    )
}

export default Blogs
