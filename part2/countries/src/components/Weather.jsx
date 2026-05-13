import service from "../services/Countries"
import axios from "axios"
import {useState, useEffect} from "react"

const {getWeather} = service
const weatherIconURL = "https://openweathermap.org/payload/api/media/file"

const Weather = ({name}) => {
    const [weather, setWeather] = useState(null)
    useEffect(
        () => {
            getWeather(name).then(
                weather => {
                    setWeather(weather)
                }
            )
        },
        []
    )
    if (!weather){
        return null
    }
    return (
        <div>
            <h1>Weather in {name}</h1>
            <p>Temperature {weather.main.feels_like} celcius</p>
            <img src = {`${weatherIconURL}/${weather.weather[0].icon}.png`}/>
            <p>Wind {weather.wind.speed}</p>
        </div>
    )
}

export default Weather
