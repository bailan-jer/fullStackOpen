import Blog from "./Blog";

const Blogs = ({ blogs, setBlogs }) => {
    const updateBlogs = (incrementedBlog) => {
        setBlogs(
            blogs.map((b) =>
                b.id === incrementedBlog.id ? incrementedBlog : b,
            ),
        );
    };

    return (
        <div>
            {blogs.map((b) => (
                <Blog key={b.id} blog={b} updateBlogs={updateBlogs} />
            ))}
        </div>
    );
};

export default Blogs;
