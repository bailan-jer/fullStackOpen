import {useState, useEffect} from "react"
import {getAllNames} from "./services/countries"
import Countries from "./components/Countries"

const filter = (allNames, value) => {
  if (value == ""){
    return []
  }
  return allNames.filter(name => name.toLowerCase().includes(value.toLowerCase()))
}

const App = () => {
  const [allNames, setAllNames] = useState([])
  const [value, setValue] = useState("")

  // fetch all names from server
  useEffect(
    () => {
      getAllNames().then(
        allNames => {
          setAllNames(allNames)
          console.log("Fetched all names")
        }
      )
    },
    []
  )

  const matchingCountry = filter(allNames, value)
  return (
    <div>
      Find countries <input value = {value} onChange = {event => {setValue(event.target.value)}}/>
      <Countries matchingCountry = {matchingCountry} setValue = {setValue} />
    </div>
  )
}

export default App
