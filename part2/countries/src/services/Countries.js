import axios from "axios"
const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

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

export default {getAllNames, getACountry}
