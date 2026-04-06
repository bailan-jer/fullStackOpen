import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState("")

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

  return (
    <div>
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
      {persons.map(person => <p key = {person.name}>{person.name} {person.phone}</p>)}
    </div>
  )
}

export default App