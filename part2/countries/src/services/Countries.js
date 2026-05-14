import axios from "axios"
const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAllNames = () => {
    return axios.get(`${baseURL}/all`).then(response => response.data.map(countryObj => countryObj.name.common))
}

const getCountry = (name) => {
    return axios.get(`${baseURL}/name/${name}`).then(response => response.data)
}

export {getAllNames, getCountry}
