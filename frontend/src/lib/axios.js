import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:27011/api/',
  withCredentials:true 
});


export default instance ; 