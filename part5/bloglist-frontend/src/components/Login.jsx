import { useState } from "react"
import loginService from "../services/login"
import blogService from "../services/blogs"

const Login = ({ setUser, notify }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const onUsernameChange = (event) => {
        event.preventDefault()
        setUsername(event.target.value)
    }

    const onPasswordChange = (event) => {
        event.preventDefault()
        setPassword(event.target.value)
    }

    const onLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            blogService.setToken(user.token)
            setUser(user)
            window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user))
            setUsername("")
            setPassword("")
        } catch {
            notify({ message: "wrong username or password", error: true, })
        }
    }

    return (
        <div>
            <h2>login to application</h2>

            <form onSubmit={ onLogin }>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={ onUsernameChange }
                        />
                    </label>
                </div>

                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={ password }
                            onChange={ onPasswordChange }
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login
