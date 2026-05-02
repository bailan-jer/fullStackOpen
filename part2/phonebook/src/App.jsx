import { useState, useEffect} from 'react'
import personsService from "./services/persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"
import "./index.css"

const baseURL =  "http://localhost:3001/persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState("")
  const [searchName, setSearchName] = useState("")
  const [message, setMessage] = useState({content: null, isError: false})

  const handleAddPerson = (event) => {
    event.preventDefault()
    const existingUser = persons.find(person => person.name === newName)
    if (!existingUser){
      personsService
        .create({name: newName, number: newPhone, id: persons.length + 1})
        .then(
          returnedPerson => {
            setMessage({content: `Added ${returnedPerson.name}`, isError: false})
            setPersons(persons.concat(returnedPerson))
            setTimeout(
              () => setMessage({content: null, isError: false}),
              5000
            )
          }
        )
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personsService
        .update(existingUser.id, {...existingUser, number: newPhone})
        .then(
          updatedPerson => {
            setMessage({content: `Updated ${updatedPerson.name}`, isError: false})
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            setTimeout(
              () => setMessage({content: null, isError: false}),
              5000
            )
          }
        )
        .catch(
          (error) => {
            setMessage({content: `Information of ${existingUser.name} has already been removed from the server`, isError: true})
            setTimeout(
             () => setMessage({content: null, isError: false}),
             5000
            )
            setPersons(persons.filter(person => person.id !== existingUser.id))
          }
        )
      }
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
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)){
      personsService.delete_(id).then(
        deletedPerson => {
          setPersons(persons.filter(person => person.id !== deletedPerson.id))
        }
      )
    }
  }

  useEffect(() => {
    personsService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  return (
    <div>
      <Notification message = {message} />
      <Filter searchName = {searchName} handleSearchName = {handleSearchName} />
      <h2>Phonebook</h2>
      <PersonForm handleAddPerson = {handleAddPerson} newName = {newName} handleNameChange = {handleNameChange}
                  newPhone = {newPhone} handlePhoneChange = {handlePhoneChange} />
      <h2>Numbers</h2>
      <Persons persons = {persons} searchName = {searchName} handleDelete = {handleDelete}/>
    </div>
  )
}

export default App