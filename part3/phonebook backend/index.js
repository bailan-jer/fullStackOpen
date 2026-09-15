const express = require("express")
const morgan = require("morgan")
const Person = require("./models/phonebook")
const app = express()
app.use(express.json())
morgan.token("body", (req, res) => {
    if (req.method === "POST"){
        if (req.body){
            return JSON.stringify(req.body)
        } else {
            return "undefined"
        }
    } 
    return " "
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))
app.use(express.static("dist"))

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(error => next(error))
})

app.get("/info", (request, response, next) => {
    const time = new Date().toUTCString()
    // console.log(time)
    // console.log(persons.length)
    Person.find({})
        .then(persons => {
            response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
        })
        .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            if (person){
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(deletedPerson => {
            if (deletedPerson){
                return response.json(deletedPerson)
            }
            return response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    if (!body.name.trim() || !body.number.trim()){
        return response.status(400).json({error: `name or number is empty`})
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const {name, number} = request.body
    if (!name.trim() || !number.trim()){
        return response.status(400).json({error: "name or/and number is empty"})
    }
    Person.findById(request.params.id)
        .then(person => {
            if (!person){
                return response.status(404).end()
            }
            person.name = name
            person.number = number
            person.save()  
                .then(updatedPerson => response.json(updatedPerson))
                .catch(error => next(error))
        })
        .catch(error => next(error))  
})

app.use((request, response) => {
    response.status(404).send({error: "Invalid URL"})
})

const errorHandler = (error, request, response, next) => {
    console.log("Error:", error.message)
    if (error.name === "CastError"){
        return response.status(400).json({"error": "malformed id"})
    } else if (error.name === "ValidationError") {
        const nameError = error.errors["name"]? error.errors["name"].message : null
        const numberError = error.errors["number"] ? error.errors["number"].message : null
        if (nameError && numberError){
            return response.status(400).json({nameError: nameError, numberError: numberError})
        } else if (nameError){
            return response.status(400).json({nameError: nameError})
        } else if (numberError){
            return response.status(400).json({numberError: numberError})
        }
    }
    next(error)
}
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
