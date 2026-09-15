if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const mongoose = require("mongoose")
const url = process.env.MONGODB_URI
mongoose.set("strictQuery", false)
console.log("connecting...")
mongoose.connect(url, {family: 4})
    .then(result => 
        console.log("Connected to Mongodb")
).catch(error => {
    console.log("error connecting to mongodb", error.message)
})
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must be of at least three"]
    },
    number: {
        type: String,
        required: true,
        minLength: [8, "Phone must be of at least eight"],
        validate: {
            validator: (v) => {
                return /\d{2,3}-\d{5,}/.test(v)
            },
            message: "Invalid phone format"
        }
    }
})
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        return returnedObject
    }
})
const Person = mongoose.model("Person", personSchema)
module.exports = Person
