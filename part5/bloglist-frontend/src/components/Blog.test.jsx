import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"
import BlogForm from "./BlogForm"

const initialBlog = {
    title: "<Blog /> renders only `title` and `author` only by default",
    author: "Bailan jer",
    likes: "12",
    url: "https://bailan-jer.com",
    "user": {
        "username": "mlukkai",
        "name": "Matti Luukkainen",
        "id": "6ae85c638d9add3f2c76b718"
    },
}

test("<Blog /> renders only `title` and `author` only by default", () => {
    render(<Blog blog = {initialBlog}
        incrementLike = { () => {console.log("updateBlog")} }
        deleteBlog = { () => {console.log("deleteBlog")}}
        user = {null}
    />)

    screen.getByText("<Blog /> renders only `title` and `author` only by default", { exact: false })
    const likes = screen.queryByText(initialBlog.likes)
    const url = screen.queryByText(initialBlog.url)

    expect(likes).toBeNull()
    expect(url).toBeNull()
})

test("<Blog /> renders `url` and `no of likes` when `show` button is clicked", async () => {
    const user = userEvent.setup()
    render(
        (
            <Blog 
                blog = {initialBlog}
                incrementLike = { () => { console.log("incrementLike")} }
                deleteBlog = { () => { console.log("deleteBlog")} }
                user = { initialBlog.user }
            />
        )
    )
    const button = screen.getByText("show")

    await user.click(button)
    screen.getByText(initialBlog.url, { exact: false })
    screen.getByText(initialBlog.likes, { exact: false })
})

test("<Blog /> `incrementBlog` event handler is called twice when `like` button is pressed twice",  async () => {
    const user = userEvent.setup()
    const mockIncrementLike = vi.fn().mockResolvedValue("success")

    render(
        (
            <Blog
                blog = { initialBlog }
                incrementLike = { mockIncrementLike }
                deleteBlog = { () => { console.log("delete blog")} }
                user = { initialBlog.user }
            />
        )
    )

    const showButton = screen.getByText("show")
    await user.click(showButton)

    const likeButton = screen.getByText("Like", { exact: false })

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockIncrementLike.mock.calls).toHaveLength(2)
})

describe("<BlogForm /> component's, ", () => {
    test("createBlog is called when a new blog is created", async () => {
        const user = userEvent.setup()
        const mockCreateBlog = vi.fn().mockResolvedValue("success")
        const title = "react element"
        const author = "bailan jer"
        const url = "https://bailan-jer.com"

        render(<BlogForm createBlog = { mockCreateBlog } />)

        const titleField = screen.getByLabelText("title")
        const authorField = screen.getByLabelText("author")
        const urlField = screen.getByLabelText("url")
        const createBlogButton = screen.getByText("create")

        await user.type(titleField, title)
        await user.type(authorField, author)
        await user.type(urlField, url)
        await user.click(createBlogButton)

        expect(mockCreateBlog.mock.calls).toHaveLength(1)
    })

    test("`title`, `author` and `url` fields are supplied correctly to createBlog", async () => {
        const user = userEvent.setup()
        const mockCreateBlog = vi.fn().mockResolvedValue("success")
        const title = "react element"
        const author = "bailan jer"
        const url = "https://bailan-jer.com"

        render(<BlogForm createBlog={mockCreateBlog}/>)

        const titleField = screen.getByLabelText("title")
        const authorField = screen.getByLabelText("author")
        const urlField = screen.getByLabelText("url")
        const createBlogButton = screen.getByText("create")

        await user.type(titleField, title)
        await user.type(authorField, author)
        await user.type(urlField, url)
        await user.click(createBlogButton)

        expect(mockCreateBlog.mock.calls).toHaveLength(1)
        const { title: receivedTitle, author: receivedAuthor, url: receivedUrl } = mockCreateBlog.mock.calls[0][0]
        expect(receivedTitle).toBe(title)
        expect(receivedAuthor).toBe(author)
        expect(receivedUrl).toBe(url)

    })
})

