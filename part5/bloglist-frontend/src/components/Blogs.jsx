import Blog from "./Blog";
import lodash from "lodash"

const Blogs = ({ blogs, setBlogs }) => {
    const updateBlogs = (incrementedBlog) => {
        setBlogs(lodash.orderBy(
                blogs.map((b) =>
                    b.id === incrementedBlog.id ? incrementedBlog : b,
                ), ["likes"], ["asc"]
        ));
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
