import { useState } from 'react'

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
      const newPerson = {name: newName, phone: newPhone}
      setPersons(persons.concat(newPerson));
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName("")
    setNewPhone("")
  }
  const handlePersonChange = (event) => {
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
      filter shown with <input value = {searchName} onChange = {handleSearchName} />
      <h2>Phonebook</h2>
      <form onSubmit = {handleAddPerson}>
        <div>
          name: <input  value = {newName} onChange = {handlePersonChange} />
        </div>
        <div>number: <input value = {newPhone} onChange = {handlePhoneChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => <p key = {person.name}>{person.name} {person.phone}</p>)}
    </div>
  )
}

export default App