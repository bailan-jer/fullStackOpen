import { useState } from 'react'

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

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState("")
  const [searchName, setSearchName] = useState("")

  const handleAddPerson = (event) => {
    event.preventDefault()
    if (!persons.find(person => person.name === newName)){
      const newPerson = {name: newName, number: newPhone}
      setPersons(persons.concat(newPerson));
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

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

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