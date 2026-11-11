import { render, screen } from "@testing-library/react"
import Blog from "./Blog"

test("<Blog renders only `title` and `author` only by default", () => {
    const blog = {
        title: "<Blog renders only `title` and `author` only by default",
        author: "Bailan jer",
        likes: "12",
        url: "https://bailan-jer.com",
    }

    render(<Blog blog = {blog} 
        updateBlog = { () => {console.log("updateBlog")} } 
        deleteBlog = { () => {console.log("deleteBlog")}}
        user = {null}
    />)

    screen.getByText("<Blog renders only `title` and `author` only by default", { exact: false })
    const likes = screen.queryByText(blog.likes)
    const url = screen.queryByText(blog.url)

    expect(likes).toBeNull()
    expect(url).toBeNull()
})