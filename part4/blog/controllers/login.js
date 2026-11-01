const loginRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

loginRouter.post("/", async (request, response) => {
    const { username, password} = request.body
    const user = await User.findOne({ username })
    if (!user) {
        return response.status(401).json({ error: "invalid username or password" })
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return response.status(401).json({ error: "invalid username or password" })
    }

    const tokenForUser = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(tokenForUser, process.env.SECRET)
    return response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
