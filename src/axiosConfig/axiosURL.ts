import axios from 'axios';

const axiosURL = axios.create({
//   baseURL: 'https://taskify-back.onrender.com',
  baseURL: 'http://localhost:4000',
});

export default axiosURL;
