import { useState, useEffect} from 'react'
import personsService from "./services/persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"

const baseURL =  "http://localhost:3001/persons"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState("")
  const [searchName, setSearchName] = useState("")

  const handleAddPerson = (event) => {
    event.preventDefault()
    const existingUser = persons.find(person => person.name === newName)
    if (!existingUser){
      personsService
        .create({name: newName, number: newPhone, id: persons.length + 1})
        .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personsService
        .update(existingUser.id, {...existingUser, number: newPhone})
        .then(
          updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
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