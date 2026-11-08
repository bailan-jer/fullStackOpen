import Blog from "./Blog";

const Blogs = ({ blogs }) => {
    return (
        <div>
            {blogs.map((b) => (
                <Blog key={b.id} blog={b} />
            ))}
        </div>
    );
};

export default Blogs;
