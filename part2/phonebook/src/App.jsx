import { useState, useEffect} from 'react'
import axios from "axios"

const baseURL =  "http://localhost:3001/persons"

const Filter = ({searchName, handleSearchName}) => {
  return (
    <div>
      filter shown with <input value = {searchName} onChange = {handleSearchName} />
    </div>
  )
}

const PersonForm = ({handleAddPerson, newName, handleNameChange, newPhone, handlePhoneChange}) => {
  return (
    <div>
      <form onSubmit = {handleAddPerson}>
        Name: <input value = {newName} onChange = {handleNameChange} /><br />
        Phone: <input value = {newPhone} onChange = {handlePhoneChange} /><br />
        <input type = "submit" />
      </form>
    </div>
  )
}

const Person = ({name, number}) => {
  return <p>{name} {number}</p>
}

const Persons = ({persons, searchName}) => {
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return personsToShow.map(person => <Person key = {person.name} {...person} />)
}

const put = (newPersonObj) => {
  // return data attribute in the response after giving an HTML PUT request
  return axios.post(baseURL, newPersonObj).then(response => response.data)
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState("")
  const [searchName, setSearchName] = useState("")

  const handleAddPerson = (event) => {
    event.preventDefault()
    if (!persons.find(person => person.name === newName)){
      put({name: newName, number: newPhone, id: persons.length + 1}).then(
        returnedPerson => setPersons(persons.concat(returnedPerson))
      )
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName("")
    setNewPhone("")
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value);
  }
  const handleSearchName = (event) => {
    setSearchName(event.target.value)
  }

  useEffect(() => {
    // console.log("Effect")
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        // console.log("promise fulfilled")
        setPersons(response.data)
      })
  }, [])
  // console.log("render", persons.length, " persons")

  return (
    <div>
      <Filter searchName = {searchName} handleSearchName = {handleSearchName} />
      <h2>Phonebook</h2>
      <PersonForm handleAddPerson = {handleAddPerson} newName = {newName} handleNameChange = {handleNameChange}
                  newPhone = {newPhone} handlePhoneChange = {handlePhoneChange} />
      <h2>Numbers</h2>
      <Persons persons = {persons} searchName = {searchName} />
    </div>
  )
}

export default App