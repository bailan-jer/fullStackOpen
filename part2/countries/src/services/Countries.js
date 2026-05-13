import axios from "axios"
const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"
const api_key = import.meta.env.VITE_API_KEY
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?"

const getAllNames = () => {
    return axios.get(`${baseURL}/all`).then(response => {
        return response.data.map(country => country.name.common)
    })
}

const getACountry = (name) => {
    return axios.get(`${baseURL}/name/${name}`).then(
        response => {
            const {name, area, capital, languages, flags} = response.data
            return {name: name.common, area, capital, languages, flag: flags.png}
        }
    )
}

const getWeather = (name) => {
    return (
        axios
            .get(`${baseURL}/name/${name}`)
            .then(
                response => {
                    const [lat, lon] = response.data.latlng
                    return axios.get(`${weatherURL}lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`).then(response => response.data)
                }
            )
    )
}

export default {getAllNames, getACountry, getWeather}
