import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ?  'http://localhost:27011/api/' : '/api' ,
  withCredentials:true 
});


export default instance ; 