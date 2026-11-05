import { useState, useEffect } from "react";
import Blogs from "./components/Blogs"
import Login from "./components/Login"
import blogService from "./services/blogs";
import loginService from "./services/login"

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    const onLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
            setUser(user)
            setUsername("")
            setPassword("")
        } catch {
            console.log("wrong credential")
        }
    }

    const onLogout = () => {
        window.localStorage.removeItem("loggedBlogappUser")
        setUser(null)
    }

    if (user === null) {
        return <Login username = {username} 
                    password = {password}
                    onPasswordChange = {({target}) => setPassword(target.value) }
                    onUsernameChange = { ({target}) => setUsername(target.value) }
                    onLogin = {onLogin}
                />
    }

    return <Blogs blogs = {blogs} user = {user} onLogout = {onLogout} />;
};

export default App;
