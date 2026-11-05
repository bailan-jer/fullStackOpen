const Login = ({ username, password, onUsernameChange, onPasswordChange, onLogin}) => {
    return (
        <div>
            <h2>login to application</h2>

            <form onSubmit = {onLogin}>
                <div>
                    <label>
                        username
                        <input type = "text"
                            value = {username}
                            onChange = {onUsernameChange}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        password
                        <input type = "password"
                            value = {password}
                            onChange = {onPasswordChange}
                        />
                    </label>
                </div>
                <button type = "submit">login</button>
            </form>
        </div>
    )
}

export default Login