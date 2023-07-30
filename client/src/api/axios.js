import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production' ? 'api/v1/trpk' : 'http://localhost:3001/api/v1/trpk'
const api = axios.create({
  baseURL
});

console.log(localStorage.getItem("accessToken"));

export default api;
