import { useState } from "react"
import blogService from "../services/blogs"

const BlogForm = ({ onBlogCreate }) => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setTitle("")
        setAuthor("")
        setUrl("")
        const blog = await blogService.create({
            title, author, url
        })
        onBlogCreate(blog)
    }

    return (
        <div>
            <h2>Create new</h2>

            <form onSubmit = {handleSubmit}>
                <div>
                    <label>
                        title
                        <input type = "text"
                            value = {title}
                            onChange = { ({target}) => setTitle(target.value) }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        author
                        <input type = "text"
                            value = {author}
                            onChange = { ({target}) => setAuthor(target.value) }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        url
                        <input type = "url"
                            value = {url}
                            onChange = { ({target}) => setUrl(target.value) }
                        />
                    </label>
                </div>
                <button type = "submit">create</button>
            </form>
        </div>
    )
};

export default BlogForm;
