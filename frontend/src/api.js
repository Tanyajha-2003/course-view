import axios from 'axios';
const API = axios.create({ baseURL: "https://course-view-1fd1.onrender.com/api" || '/api' });
API.interceptors.request.use(config=>{
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default API;

API.interceptors.request.use(config=>{
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default API;
