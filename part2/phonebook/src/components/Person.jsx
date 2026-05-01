const Person = ({name, number, id, handleDelete}) => {
  return (
          <p>
            {name} {number} <button onClick = {() => handleDelete(id, name)}>Delete</button>
          </p>
  )
}

export default Person
