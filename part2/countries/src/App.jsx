import Countries from "./components/Countries"
import {useState, useEffect} from "react"
import service from "./services/Countries"

const {getAllNames, getACountry} = service

const App = () => {
  const [allNames, setAllNames] = useState([])
  const [searchCountry, setSearchCountry] = useState("")
  const handleChange = (event) => {
    setSearchCountry(event.target.value)
  }
  
  const props = {searchCountry, handleChange, allNames, setSearchCountry}

  useEffect(
    () => {
      getAllNames().then(
        names => {
          setAllNames(names)
          console.log("Set allNames successfully")
        }
      )
    },
    []
  )

  return (
    <div>
      <Countries {...props} />
    </div>
  )
}

export default App