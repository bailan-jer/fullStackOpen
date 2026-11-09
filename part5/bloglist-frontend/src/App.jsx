import { useState, useEffect, useRef } from "react";
import Blogs from "./components/Blogs";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import Toggleable from "./components/Toggleable";
import BlogForm from "./components/BlogForm";
import lodash from "lodash";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({
        message: null,
        error: true,
    });
    const blogFormRef = useRef();

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(lodash.orderBy(blogs)));
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            blogService.setToken(user.token);
            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user),
            );
            setUser(user);
            setUsername("");
            setPassword("");
        } catch {
            setNotification({
                message: "wrong username or password",
                error: true,
            });
            setTimeout(
                () => setNotification({ message: null, error: true }),
                5000,
            );
        }
    };

    const onLogout = () => {
        window.localStorage.removeItem("loggedBlogappUser");
        setUser(null);
    };

    const createBlog = async (blogObject) => {
        try {
            const createdBlog = await blogService.create(blogObject);
            setBlogs(blogs.concat(createdBlog));
            setNotification({
                message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
                error: false,
            });
            blogFormRef.current.toggleVisibility();
        } catch {
            setNotification({
                message: "error when creating new blog",
                error: true,
            });
        } finally {
            setTimeout(() => {
                setNotification({ message: null, error: true });
            }, 5000);
        }
    };

    if (user === null) {
        return (
            <div>
                <Notification notification={notification} />
                <Login
                    username={username}
                    password={password}
                    onPasswordChange={({ target }) => setPassword(target.value)}
                    onUsernameChange={({ target }) => setUsername(target.value)}
                    onLogin={onLogin}
                />
            </div>
        );
    }

    return (
        <div>
            <Notification notification={notification} />

            <h2>Blogs</h2>
            <p>
                {user.username} logged in
                <button onClick={onLogout}>logout</button>
            </p>

            <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
            </Toggleable>
            <Blogs blogs={blogs} setBlogs={setBlogs} />
        </div>
    );
};

export default App;
