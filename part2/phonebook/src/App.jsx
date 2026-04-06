import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleAddPerson = (event) => {
    event.preventDefault()
    const newPerson = {name: newName}
    setPersons(persons.concat(newPerson));
    setNewName("")
  }
  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit = {handleAddPerson}>
        <div>
          name: <input  value = {newName} onChange = {handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key = {person.name}>{person.name}</p>)}
    </div>
  )
}

export default App