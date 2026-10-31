const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (request, response) => {
    const users = await User.find({})
    return response.status(200).json(users)
})

usersRouter.get("/:id", async (request, response) => {
    const user = await User.findById(request.params.id)
    if (!user) {
        return response.status(404).end()
    }
    return response.status(200).json(user)
})

usersRouter.post("/", async (request, response) => {
    const { username, name, password} = request.body
    if (password.length < 3) {
        return response.status(400).json({ error: "password invalid"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const userToCreate = new User({
        username,
        name,
        passwordHash,
    })

    await userToCreate.save()
    return response.status(201).json(userToCreate)
})

module.exports = usersRouter
