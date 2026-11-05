import { useState, useEffect } from "react";
import Blogs from "./components/Blogs";
import Login from "./components/Login";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({
        message: null,
        error: true,
    });

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

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

    const onBlogCreate = (newBlog) => {
        setBlogs(blogs.concat(newBlog));
        setNotification({
            message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
            error: false,
        });
        setTimeout(() => setNotification({ message: null, error: true }), 5000);
    };

    if (user === null) {
        return (
            <div>
                <Notification notification = {notification} />
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
            <Blogs
                blogs={blogs}
                user={user}
                onLogout={onLogout}
                onBlogCreate={onBlogCreate}
            />
        </div>
    );
};

export default App;
