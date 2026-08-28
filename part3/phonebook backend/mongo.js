const mongoose = require("mongoose")
const argv_len = process.argv.length
if (argv_len !== 3 && argv_len !== 5){
    console.log("Invalid number of arguments. 3 or 5 arguments needed")
    process.exit(1)
}
const pwd = process.argv[2]
const url = `mongodb+srv://bailanjer_db_user:${pwd}@cluster0.w2m3gxz.mongodb.net/?appName=Cluster0`
mongoose.set("strictQuery", false)
mongoose.connect(url, {family: 4})
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model("Person", personSchema)
if (argv_len === 3){
    Person.find({}).then(result => {
        console.log("phonebook: ")
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3], number = process.argv[4]
    const person = new Person({name, number})
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number}`)
        mongoose.connection.close()
    })
}
