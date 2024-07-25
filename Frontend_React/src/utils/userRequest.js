import axios from 'axios';

// Creating an instance of Axios with a base URL for the API
const API = axios.create({baseURL: 'http://localhost:3001'});

// getting the user 
export const getUser = (userId) => API.get(`/user/${userId}`);