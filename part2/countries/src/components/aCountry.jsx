import service from "../services/Countries"
import {useState} from "react"

const getACountry = service.getACountry

const ACountry = ({name}) => {
    const [oneCountry, setOneCountry] = useState({})
    getACountry(name).then(response => setOneCountry(response))
    if (Object.keys(oneCountry).length === 0){
        return null
    }
    return (
        <div>
            <h1>{oneCountry.name}</h1>
            <p>Capital {oneCountry.capital}</p>
            <p>Area {oneCountry.area}</p>
            <h1>Languages</h1>
            <ul>
                {Object.values(oneCountry.languages).map(language => <li key = {language}>{language}</li>)}
            </ul>
            <img src = {oneCountry.flag} />
        </div>
    )
}

export default ACountry
