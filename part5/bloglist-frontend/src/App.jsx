import { useState, useEffect, useRef } from "react"
import Blogs from "./components/Blogs"
import Login from "./components/Login"
import blogService from "./services/blogs"
import Notification from "./components/Notification"
import Toggleable from "./components/Toggleable"
import BlogForm from "./components/BlogForm"
import lodash from "lodash"

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({
        message: null,
        error: true,
    })
    const blogFormRef = useRef()

    const getAllBlogs = () => {
        useEffect(() => {
            blogService.getAll().then(blogs => setBlogs(lodash.orderBy(blogs, ["likes"], ["asc"])))
        }, [])
    }

    const checkLoggedIn = () => {
        useEffect(() => {
            const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
            if (loggedUserJSON) {
                const user = JSON.parse(loggedUserJSON)
                setUser(user)
                blogService.setToken(user.token)
            }
        }, [])
    }

    const onLogout = () => {
        window.localStorage.removeItem("loggedBlogappUser")
        setUser(null)
    }

    const notify = (aMessage) => {
        setNotification(aMessage)
        setTimeout(() => {
            setNotification({ message: null, error: true, })
        }, 5000)
    }

    const createBlog = async (blog) => {
        try {
            const createdBlog = await blogService.create(blog)
            setBlogs(lodash.orderBy(blogs.concat(createdBlog), ["likes"], ["asc"]))
            notify({
                message: `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
                error: false,
            })
            blogFormRef.current.toggleVisibility()
        } catch {
            notify({
                message: "error when creating new blog",
                error: true,
            })
        }     
    }

    const loggedIn = () => {
        return user !== null
    }

    const incrementLike = async (blog) => {
        blog = await blogService.update(blog, blog.id)
        const orderBlogs = () => lodash.orderBy(
            blogs.map(b => b.id === blog.id ? blog : b),
            ["likes"],
            ["asc"]
        )

        setBlogs(orderBlogs())
    }

    const deleteBlog = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.del(blog.id)
                setBlogs(blogs.filter(b => b.id !== blog.id))
                notify({ message: `Blog ${blog.title} by ${blog.author} has been deleted`})
            } catch {
                console.log("error deleting")
            }
        }
    }

    const renderScreen = () => {
        if (loggedIn()) {
            return (
                <div>
                    <Notification notification = { notification } />

                    <h2>Blogs</h2>
                    <p>
                        { user.username } logged in
                        <button onClick = { onLogout }>logout</button>
                    </p>

                    <Toggleable buttonLabel = "create new blog" ref = { blogFormRef} >
                        <BlogForm createBlog = { createBlog } />
                    </Toggleable>

                    <Blogs blogs = { blogs } incrementLike = { incrementLike } deleteBlog = { deleteBlog } setBlogs = { setBlogs } user = { user } />
                </div>
            )
            
        } else {
            return (
                <div>
                    <Notification notification = { notification } />
                    <Login
                        notify = { notify }
                        setUser = { setUser }
                    />
                </div>
            )
        }
    }
    
    getAllBlogs()
    checkLoggedIn()
    return renderScreen()
}

export default App
