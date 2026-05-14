import axios from "axios"
const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&"
const api_key = import.meta.env.VITE_API_KEY

const getAllNames = () => {
    return axios.get(`${baseURL}/all`).then(response => response.data.map(countryObj => countryObj.name.common))
}

const getCountry = (name) => {
    return axios.get(`${baseURL}/name/${name}`).then(response => response.data)
}

const getWeatherData = (lat, lon) => {
    return axios.get(`${weatherURL}lat=${lat}&lon=${lon}&appid=${api_key}`).then(
        response => {
            const data = response.data
            return {temperature: data.main.temp, speed: data.wind.speed}
        }
    )
}

export {getAllNames, getCountry, getWeatherData}
