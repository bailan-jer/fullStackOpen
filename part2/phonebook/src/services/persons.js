import axios from "axios"
const baseURL = "/api/persons"

const getAll = () => {
    return axios.get(baseURL).then(response => response.data)
}

const create = (newObj) => {
    return axios.post(baseURL, newObj).then(response => response.data)
}

const update = (id, newObj) => {
    return axios.put(`${baseURL}/${id}`, newObj).then(response => response.data)
}

const delete_ = (id) => {
    return axios.delete(`${baseURL}/${id}`).then(response => response.data)
}

export default {getAll, create, update, delete_}
