import axios from "axios";
const baseUrl = "/api/blogs";
let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const create = async (blog) => {
    const config = {
        headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, blog, config);
    return response.data;
};

const update = async (blogObject, id) => {
    const config = {
        headers: {
            Authorization: token,
        },
    };
    const updatedBlog = await axios.put(`${baseUrl}/${id}`, blogObject, config);
    return updatedBlog.data;
};

export default { getAll, create, setToken, update };
