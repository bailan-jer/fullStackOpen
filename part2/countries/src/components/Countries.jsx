import {useEffect, useState} from "react"
import {getCountry, getWeatherData} from "../services/countries"

const Countries = ({matchingCountry, setValue}) => {
    const [country, setCountry] = useState({})
    const [weather, setWeather] = useState({})
    useEffect(
        () => {
            if (matchingCountry.length === 1){
                getCountry(matchingCountry[0]).then(
                    country => {
                        setCountry(country)
                        const {latlng} = country
                        getWeatherData(latlng[0], latlng[1]).then(weather => setWeather(weather))
                    }
                )
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
        const {capital, area, languages, flags, name, latlng} = country
        let weatherHTML = null
        if (Object.keys(weather).length > 0){
            weatherHTML = (
                <div>
                    <p>Temperature {weather.temperature} Celcius</p>
                    <p>Wind {weather.speed} m/s</p>
                </div>
            )
        }
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
                <h2>Weather in {name.common}</h2>
                {weatherHTML ? weatherHTML : null}
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
