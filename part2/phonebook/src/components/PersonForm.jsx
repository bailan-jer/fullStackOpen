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

export default PersonForm
