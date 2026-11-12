import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import userEvent from "@testing-library/user-event"

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
        updateBlog = { () => {console.log("updateBlog")} }
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
    render(<Blog blog = {initialBlog}
        updateBlog = { () => { console.log("updateBlog")} }
        deleteBlog = { () => { console.log("deleteBlog")} }
        user = { initialBlog.user }
    />)
    const button = screen.getByText("show")

    await user.click(button)
    screen.getByText(initialBlog.url, { exact: false })
    screen.getByText(initialBlog.likes, { exact: false })
})