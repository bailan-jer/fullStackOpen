import Person from "./Person"

const Persons = ({persons, searchName, handleDelete}) => {
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return personsToShow.map(person => <Person key = {person.name} handleDelete = {handleDelete} {...person} />)
}

export default Persons
