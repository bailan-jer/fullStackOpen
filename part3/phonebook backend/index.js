const express = require("express")
const morgan = require("morgan")
const Person = require("./models/phonebook")
const app = express()
const UPPER_LIMIT = 1e10
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

const generateID = () => {
    return Math.floor(Math.random() * UPPER_LIMIT + 1)
}

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get("/info", (request, response) => {
    const time = new Date().toUTCString()
    // console.log(time)
    // console.log(persons.length)
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${time}</p>`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => response.json(person))
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    deletedPerson = persons.find(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
    if (!deletedPerson){
        return response.status(404).json({error: "Person not found"})
    }
    response.json(deletedPerson)
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name.trim() || !body.number.trim()){
        return response.status(400).json({error: `name or number is empty`})
    }
    if (persons.find(person => person.name === body.name)){
        return response.status(400).json({error: "Name must be unique"})
    }
    const person = {
        id: String(generateID()),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    return response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
