import {useEffect, useState} from "react"
import {getCountry} from "../services/countries"

const Countries = ({matchingCountry, setValue}) => {
    const handleClick = (name) => {
        event.preventDefault()
        setValue(name)
    }

    const [country, setCountry] = useState({})
    useEffect(
        () => {
            if (matchingCountry.length === 1){
                getCountry(matchingCountry[0]).then(country => setCountry(country))
                // setTimeout(() => getCountry(matchingCountry[0]).then(country => setCountry(country)), 3000)
            }
        },
        [matchingCountry]
    )
    if (matchingCountry.length === 0){
        return null
    } else if (matchingCountry.length > 10){
        return <p>Too many matches, specify another filter</p>
    } else if (matchingCountry.length === 1){
        if (Object.keys(country).length === 0){
            return null
        }
        const {capital, area, languages, flags, name} = country
        return (
            <div>
                <h1>{name.common}</h1>
                <p>Capital {capital}</p>
                <p>Area {area}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(languages).map(language => <li key = {language}>{language}</li>)}
                </ul>
                <img src = {flags.png} />
            </div>
        )
    } else {
        return (
            <ul>
                {matchingCountry.map(
                    name => (
                        <li key = {name}>
                            {name} 
                            <input type = "button" value = "show" onClick = {
                                (event) => {
                                    event.preventDefault()
                                    setValue(name)
                                }
                            }/>
                        </li>
                    )
                )
                }
            </ul>
        )
    }
}

export default Countries
