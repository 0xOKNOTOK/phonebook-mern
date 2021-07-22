import axios from 'axios';
const baseUrl = 'http://localhost:5000/api/persons';

const getAllPeople = () => {
    const req = axios.get(baseUrl);
    return req.then((res) => res.data.data);
};

const addNewPersons = (personObject) => {
    const req = axios.post(baseUrl, personObject);
    return req.then((res) => res.data);
};

const updatePersons = (id, personObject) => {
    const req = axios.put(`${baseUrl}/${id}`, personObject);
    return req.then((res) => res.data);
};

const deletePerson = (id) => {
    const req = axios.delete(`${baseUrl}/${id}`);
    return req.then((res) => res.data);
};
const personService = {
    getAllPeople,
    addNewPersons,
    updatePersons,
    deletePerson,
};

export default personService;
