import axios from 'axios'
const baseurl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseurl);
    return request.then(response => {
        return response.data;
    })
}

const create = (newContact) => {
    const request = axios.post(baseurl, newContact);
    return request.then(response => response.data)
}

const deletion = (id) => {
    const request = axios.delete(`${baseurl}/${id}`);
    return request.then(response => response.data);
}

const update = (newContact, id) => {
    const request = axios.put(`${baseurl}/${id}`, newContact)
    return request.then(response => response.data)
}
export default {getAll, create, deletion, update}